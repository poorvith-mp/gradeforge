import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_GRADING_SCALES } from '../src/constants/presets.ts';
import { convertToPercentage, formatWorkedSGPA } from '../src/utils/calculations.ts';

function evaluateFormula(formulaStr, cgpa, maxScale = 10) {
  let expr = formulaStr.trim();
  if (expr.startsWith('if ')) {
    const match = expr.match(/^if\s+CGPA\s*<\s*(\d+(?:\.\d+)?)\s*:\s*(.+?)\s+else\s*:\s*(.+)$/);
    if (match) {
      const threshold = parseFloat(match[1]);
      expr = cgpa < threshold ? match[2] : match[3];
    }
  }
  const sanitized = expr
    .replaceAll('CGPA', String(cgpa))
    .replaceAll('max', String(maxScale))
    .replaceAll('−', '-')
    .replaceAll('×', '*')
    .replaceAll('÷', '/');
  const raw = Function(`"use strict"; return (${sanitized})`)();
  return Math.min(100, Math.max(0, Number(raw)));
}

test('every preset has formula.sgpa, formula.cgpa, and formula.percentage', () => {
  for (const scale of PRESET_GRADING_SCALES) {
    assert.ok(scale.formula, `Scale ${scale.id} must define formula`);
    assert.ok(scale.formula.sgpa, `Scale ${scale.id} must define formula.sgpa`);
    assert.ok(scale.formula.cgpa, `Scale ${scale.id} must define formula.cgpa`);
    assert.ok(scale.formula.percentage, `Scale ${scale.id} must define formula.percentage`);
  }
});

test('drift evaluator matches convertToPercentage on all presets for sample CGPAs', () => {
  const sampleCGPAs = [5.0, 6.75, 8.5, 9.9];
  for (const scale of PRESET_GRADING_SCALES) {
    if (!scale.formula?.percentage) continue;
    for (const cgpa of sampleCGPAs) {
      // German scale is inverted (1.0 to 5.0) - only test within 1.0 - 5.0 range
      const testCGPA = scale.id === 'german-scale' ? Math.min(5.0, Math.max(1.0, 6.0 - (cgpa / 2))) : (scale.maxScale === 4 ? (cgpa / 2.5) : (scale.maxScale === 7 ? (cgpa * 0.7) : cgpa));
      const evaluated = evaluateFormula(scale.formula.percentage, testCGPA, scale.maxScale);
      const expectedStr = convertToPercentage(testCGPA, scale.id, scale.maxScale);
      const expectedPct = parseFloat(expectedStr.replace('%', '').trim());
      assert.ok(
        Math.abs(evaluated - expectedPct) < 0.05,
        `Scale ${scale.id} drifted at CGPA ${testCGPA}: evaluated ${evaluated.toFixed(2)} vs expected ${expectedPct.toFixed(2)}`
      );
    }
  }
});

test('formatWorkedSGPA produces exact step-by-step numbers', () => {
  const vtuScale = PRESET_GRADING_SCALES.find((s) => s.id === 'vtu');
  assert.ok(vtuScale);

  // 4 subjects: credits [4, 3, 4, 2] with points [9, 8, 10, 7] (grades A, B, S, C)
  const subjects = [
    { id: '1', name: 'Sub 1', credits: 4, gradeLabel: 'A' },
    { id: '2', name: 'Sub 2', credits: 3, gradeLabel: 'B' },
    { id: '3', name: 'Sub 3', credits: 4, gradeLabel: 'S' },
    { id: '4', name: 'Sub 4', credits: 2, gradeLabel: 'C' },
  ];

  const result = formatWorkedSGPA(subjects, vtuScale);
  assert.equal(result, '(4×9 + 3×8 + 4×10 + 2×7) ÷ 13 = 8.77');
});

test('formatWorkedSGPA returns dash on empty or invalid inputs', () => {
  const vtuScale = PRESET_GRADING_SCALES.find((s) => s.id === 'vtu');
  assert.equal(formatWorkedSGPA([], vtuScale), '—');
  assert.equal(formatWorkedSGPA([{ id: '1', name: 'Sub', credits: 0, gradeLabel: 'A' }], vtuScale), '—');
});
