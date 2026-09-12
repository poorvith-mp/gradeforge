import test from 'node:test';
import assert from 'node:assert/strict';
import { validateState, defaultState } from '../src/utils/storage.ts';

test('validates 2.0.0 state fixture cleanly without errors', () => {
  const v2Fixture = {
    selectedScaleId: 'vtu',
    customScales: [],
    semesters: [
      {
        id: 'sem-1',
        name: 'Semester 1',
        subjects: [
          { id: 'sub-1', name: 'Engineering Mathematics I', credits: 4, gradeLabel: 'S' },
          { id: 'sub-2', name: 'Engineering Physics', credits: 4, gradeLabel: 'A' },
          { id: 'sub-3', name: 'Basic Electrical Eng', credits: 3, gradeLabel: 'B' },
        ],
      },
    ],
  };

  const validated = validateState(v2Fixture);
  assert.equal(validated.selectedScaleId, 'vtu');
  assert.equal(validated.semesters.length, 1);
  assert.equal(validated.semesters[0].subjects.length, 3);
  assert.equal(validated.profile, undefined);
});

test('supports optional profile.name and trims input', () => {
  const stateWithName = {
    selectedScaleId: 'vtu',
    customScales: [],
    semesters: [],
    profile: {
      name: '  Ada Lovelace  ',
    },
  };

  const validated = validateState(stateWithName);
  assert.deepEqual(validated.profile, { name: 'Ada Lovelace' });
});

test('drops unknown keys for security and hygienic storage', () => {
  const dirtyState = {
    selectedScaleId: 'vtu',
    customScales: [],
    semesters: [],
    unknownSecretKey: 'should-not-exist',
    nestedTrash: { malicious: true },
  };

  const validated = validateState(dirtyState);
  assert.equal('unknownSecretKey' in validated, false);
  assert.equal('nestedTrash' in validated, false);
  assert.deepEqual(Object.keys(validated).sort(), ['customScales', 'selectedScaleId', 'semesters']);
});

test('handles malformed inputs by falling back to defaultState', () => {
  assert.deepEqual(validateState(null), defaultState());
  assert.deepEqual(validateState(undefined), defaultState());
  assert.deepEqual(validateState('corrupt-string'), defaultState());
  assert.deepEqual(validateState(42), defaultState());
});
