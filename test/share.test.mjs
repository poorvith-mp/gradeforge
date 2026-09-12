import test from 'node:test';
import assert from 'node:assert/strict';
import { encodePlanToUrl, decodePlanFromHash } from '../src/utils/sharePlan.ts';

const sampleTwoSemesterState = {
  selectedScaleId: 'vtu',
  customScales: [],
  semesters: [
    {
      id: 'sem-1',
      name: 'Semester 1',
      subjects: [
        { id: 'sub-1', name: 'Mathematics I', credits: 4, gradeLabel: 'S' },
        { id: 'sub-2', name: 'Physics', credits: 4, gradeLabel: 'A' },
        { id: 'sub-3', name: 'Electrical Engineering', credits: 3, gradeLabel: 'B' },
        { id: 'sub-4', name: 'Engineering Graphics', credits: 3, gradeLabel: 'A' },
      ],
    },
    {
      id: 'sem-2',
      name: 'Semester 2',
      subjects: [
        { id: 'sub-5', name: 'Mathematics II', credits: 4, gradeLabel: 'A' },
        { id: 'sub-6', name: 'Chemistry', credits: 4, gradeLabel: 'B' },
        { id: 'sub-7', name: 'Programming in C', credits: 3, gradeLabel: 'S' },
      ],
    },
  ],
};

test('encode and decode round trip with CompressionStream produces compact URL (< 1,000 chars)', async () => {
  const result = await encodePlanToUrl(sampleTwoSemesterState);
  assert.equal(result.success, true);
  assert.ok(result.url);
  assert.ok(result.hash?.startsWith('#plan='));
  assert.ok(result.url.length < 1000, `URL length is ${result.url.length}, expected < 1000`);

  const decoded = await decodePlanFromHash(result.hash);
  assert.equal(decoded.success, true);
  assert.ok(decoded.state);
  assert.equal(decoded.state.selectedScaleId, 'vtu');
  assert.equal(decoded.state.semesters.length, 2);
  assert.equal(decoded.state.semesters[0].subjects.length, 4);
  assert.equal(decoded.state.semesters[1].subjects.length, 3);
  assert.equal(decoded.state.semesters[0].subjects[0].credits, 4);
  assert.equal(decoded.state.semesters[0].subjects[0].gradeLabel, 'S');
});

test('fallback to uncompressed #planr= works when CompressionStream is absent', async () => {
  const originalCS = globalThis.CompressionStream;
  const originalDS = globalThis.DecompressionStream;
  try {
    delete globalThis.CompressionStream;
    const result = await encodePlanToUrl(sampleTwoSemesterState);
    assert.equal(result.success, true);
    assert.ok(result.hash?.startsWith('#planr='));

    const decoded = await decodePlanFromHash(result.hash);
    assert.equal(decoded.success, true);
    assert.ok(decoded.state);
    assert.equal(decoded.state.selectedScaleId, 'vtu');
    assert.equal(decoded.state.semesters.length, 2);
  } finally {
    globalThis.CompressionStream = originalCS;
    globalThis.DecompressionStream = originalDS;
  }
});

test('rejects malformed or invalid hashes without throwing', async () => {
  const malformedHashes = [
    '',
    '#',
    '#not-a-plan',
    '#plan=!!!invalid-base64',
    '#planr=notjson',
  ];

  for (const hash of malformedHashes) {
    const decoded = await decodePlanFromHash(hash);
    assert.equal(decoded.success, false);
    assert.ok(decoded.error);
  }
});

test('enforces 64 KB safety limit on incoming payload without throwing', async () => {
  const hugePayload = 'A'.repeat(70 * 1024);
  const decoded = await decodePlanFromHash(`#planr=${hugePayload}`);
  assert.equal(decoded.success, false);
  assert.match(decoded.error, /safety limit/i);
});

test('validates and sanitizes decoded state (invalid credits filtered/handled)', async () => {
  const payloadWithDirtyTypes = {
    s: 'vtu',
    c: [],
    m: [
      {
        i: 'sem-1',
        n: 'Sem 1',
        b: [
          { i: 'sub-1', n: 'Invalid Sub', c: 'not-a-number', g: 'A' },
          { i: 'sub-2', n: 'Valid Sub', c: 4, g: 'S' },
        ],
      },
    ],
  };

  const jsonStr = JSON.stringify(payloadWithDirtyTypes);
  const base64 = Buffer.from(jsonStr).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const decoded = await decodePlanFromHash(`#planr=${base64}`);

  assert.equal(decoded.success, true);
  assert.ok(decoded.state);
  // 'not-a-number' is sanitized to '' by validateState
  assert.equal(decoded.state.semesters[0].subjects[0].credits, '');
  assert.equal(decoded.state.semesters[0].subjects[1].credits, 4);
});
