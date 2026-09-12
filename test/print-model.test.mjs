import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPrintModel, PRINT_WATERMARK } from '../src/utils/printModel.ts';
import { defaultState } from '../src/utils/storage.ts';

test('buildPrintModel returns empty: true on default empty state', () => {
  const model = buildPrintModel(defaultState());
  assert.equal(model.empty, true);
  assert.equal(model.watermark, PRINT_WATERMARK);
  assert.equal(model.cgpa, null);
});

test('buildPrintModel builds complete model for populated state', () => {
  const state = {
    selectedScaleId: 'vtu',
    customScales: [],
    profile: { name: 'Alan Turing' },
    semesters: [
      {
        id: 'sem-1',
        name: 'Semester 1',
        subjects: [
          { id: 's1', name: 'Discrete Math', credits: 4, gradeLabel: 'S' },
          { id: 's2', name: 'Computer Architecture', credits: 4, gradeLabel: 'A' },
        ],
      },
    ],
  };

  const model = buildPrintModel(state, '2026-09-12');
  assert.equal(model.empty, false);
  assert.equal(model.studentName, 'Alan Turing');
  assert.equal(model.scaleName, 'VTU (10-point) — CBCS');
  assert.match(model.scaleProvenance, /Verified 2026-09-01/);
  assert.equal(model.semesters.length, 1);
  assert.equal(model.semesters[0].totalCredits, 8);
  assert.equal(model.semesters[0].sgpa, 9.5);
  assert.equal(model.cgpa, 9.5);
  assert.equal(model.totalCredits, 8);
  assert.equal(model.percentageString, '87.50% (VTU)');
  assert.equal(model.percentageFormula, '(CGPA − 0.75) × 10');
  assert.equal(model.generatedDate, '2026-09-12');
  assert.equal(model.watermark, 'Self-calculated with GradeForge. Not an official transcript.');
});
