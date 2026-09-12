import type { GradeState } from '../types/grade.ts';
import { getActiveScale } from './storage.ts';
import { calculateOverall, convertToPercentage, getPercentageFormula } from './calculations.ts';

export const PRINT_WATERMARK = 'Self-calculated with GradeForge. Not an official transcript.';

export interface PrintSubjectRow {
  id: string;
  name: string;
  credits: number | '';
  gradeLabel: string;
  gradePoint: number | null;
}

export interface PrintSemesterRow {
  id: string;
  name: string;
  sgpa: number | null;
  totalCredits: number;
  subjects: PrintSubjectRow[];
}

export interface PrintModel {
  empty: boolean;
  studentName?: string;
  scaleName: string;
  scaleProvenance: string;
  semesters: PrintSemesterRow[];
  cgpa: number | null;
  totalCredits: number;
  percentageString: string;
  percentageFormula: string;
  generatedDate: string;
  watermark: string;
}

export function buildPrintModel(state: GradeState, dateStr?: string): PrintModel {
  const scale = getActiveScale(state);
  const pointMap = new Map<string, number>(
    scale.grades.map((g) => [g.label.trim().toUpperCase(), Number(g.point)])
  );

  const overall = calculateOverall(state.semesters || [], scale);

  const totalValidSubjects = overall.semesterResults.reduce(
    (acc, s) => acc + s.validSubjectCount,
    0
  );

  const empty = !state.semesters || state.semesters.length === 0 || totalValidSubjects === 0;

  let scaleProvenance = 'Community preset, unverified';
  if (scale.verifiedAgainst) {
    scaleProvenance = `Verified ${scale.verifiedOn || 'official source'}`;
  } else if (scale.isCustom) {
    scaleProvenance = 'Custom user-defined scale';
  }

  const semesters: PrintSemesterRow[] = state.semesters.map((sem, idx) => {
    const semCalc = overall.semesterResults[idx];
    return {
      id: sem.id,
      name: sem.name || `Semester ${idx + 1}`,
      sgpa: semCalc?.sgpa ?? null,
      totalCredits: semCalc?.totalCredits ?? 0,
      subjects: (sem.subjects || []).map((sub) => {
        const gradeLabel = String(sub.gradeLabel ?? '').trim().toUpperCase();
        const pt = pointMap.get(gradeLabel);
        return {
          id: sub.id,
          name: sub.name || 'Untitled Subject',
          credits: sub.credits,
          gradeLabel: sub.gradeLabel,
          gradePoint: pt !== undefined ? pt : null,
        };
      }),
    };
  });

  const percentageString = convertToPercentage(overall.cgpa, scale.id, scale.maxScale);
  const percentageFormula = getPercentageFormula(scale);

  return {
    empty,
    studentName: state.profile?.name?.trim() || undefined,
    scaleName: scale.name,
    scaleProvenance,
    semesters,
    cgpa: overall.cgpa,
    totalCredits: overall.totalCredits,
    percentageString,
    percentageFormula,
    generatedDate: dateStr || new Date().toISOString().split('T')[0],
    watermark: PRINT_WATERMARK,
  };
}
