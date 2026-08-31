import type { GradingScale, Subject, Semester, SemesterCalculation, OverallCalculation, TargetPlanResult, Grade } from '../types/grade.ts';

export function calculateSGPA(subjects: Subject[], scale: GradingScale): SemesterCalculation {
  if (!Array.isArray(subjects) || !scale?.grades) {
    return {
      semesterId: '',
      sgpa: null,
      totalCredits: 0,
      weightedPoints: 0,
      validSubjectCount: 0,
      totalSubjectCount: Array.isArray(subjects) ? subjects.length : 0,
    };
  }

  const pointMap = new Map<string, number>(
    scale.grades.map((g) => [g.label.trim().toUpperCase(), Number(g.point)])
  );

  let weighted = 0;
  let credits = 0;
  let validCount = 0;

  for (const subject of subjects) {
    const credit = typeof subject.credits === 'number' ? subject.credits : parseFloat(String(subject.credits));
    const gradeLabel = String(subject.gradeLabel ?? '').trim().toUpperCase();
    const point = pointMap.get(gradeLabel);

    if (Number.isFinite(credit) && credit > 0 && point !== undefined && Number.isFinite(point)) {
      weighted += credit * point;
      credits += credit;
      validCount++;
    }
  }

  return {
    semesterId: '',
    sgpa: credits > 0 ? weighted / credits : null,
    totalCredits: credits,
    weightedPoints: weighted,
    validSubjectCount: validCount,
    totalSubjectCount: subjects.length,
  };
}

export function calculateOverall(semesters: Semester[], scale: GradingScale): OverallCalculation {
  if (!Array.isArray(semesters) || !scale?.grades) {
    return {
      cgpa: null,
      totalCredits: 0,
      totalWeightedPoints: 0,
      totalSemesters: 0,
      totalSubjects: 0,
      semesterResults: [],
    };
  }

  const semesterResults: SemesterCalculation[] = semesters.map((sem) => {
    const calc = calculateSGPA(sem.subjects || [], scale);
    calc.semesterId = sem.id;
    return calc;
  });

  let totalWeighted = 0;
  let totalCredits = 0;
  let totalSubjects = 0;

  for (const res of semesterResults) {
    totalWeighted += res.weightedPoints;
    totalCredits += res.totalCredits;
    totalSubjects += res.totalSubjectCount;
  }

  return {
    cgpa: totalCredits > 0 ? totalWeighted / totalCredits : null,
    totalCredits,
    totalWeightedPoints: totalWeighted,
    totalSemesters: semesters.length,
    totalSubjects,
    semesterResults,
  };
}

export function calculateTargetPlan(
  currentCGPA: number | null,
  currentCredits: number,
  targetCGPA: number,
  remainingSemesters: number,
  avgCreditsPerSem: number,
  maxScale: number = 10
): TargetPlanResult {
  if (remainingSemesters <= 0 || avgCreditsPerSem <= 0) {
    return {
      targetCGPA,
      remainingSemesters,
      avgCreditsPerSem,
      requiredSGPA: null,
      isAchievable: false,
      statusType: 'impossible',
      explanation: 'Please enter at least 1 remaining semester with positive credits per semester.',
    };
  }

  const currentEarnedPoints = (currentCGPA !== null && currentCredits > 0) ? currentCGPA * currentCredits : 0;
  const futureCredits = remainingSemesters * avgCreditsPerSem;
  const totalFutureCredits = currentCredits + futureCredits;
  const totalTargetPoints = targetCGPA * totalFutureCredits;
  const requiredFuturePoints = totalTargetPoints - currentEarnedPoints;
  const requiredSGPA = requiredFuturePoints / futureCredits;

  if (requiredSGPA <= 0) {
    return {
      targetCGPA,
      remainingSemesters,
      avgCreditsPerSem,
      requiredSGPA: 0,
      isAchievable: true,
      statusType: 'achieved',
      explanation: `You have already secured enough credit points! Even with a minimal passing SGPA, your CGPA will be at or above ${targetCGPA.toFixed(2)}.`,
    };
  }

  if (requiredSGPA > maxScale) {
    const maxPossibleCGPA = (currentEarnedPoints + (futureCredits * maxScale)) / totalFutureCredits;
    return {
      targetCGPA,
      remainingSemesters,
      avgCreditsPerSem,
      requiredSGPA,
      isAchievable: false,
      statusType: 'impossible',
      explanation: `Mathematically unreachable. Even if you score a perfect ${maxScale.toFixed(1)} SGPA in all ${remainingSemesters} remaining semesters, your maximum reachable CGPA is ${maxPossibleCGPA.toFixed(2)}.`,
    };
  }

  if (requiredSGPA >= maxScale * 0.92) {
    return {
      targetCGPA,
      remainingSemesters,
      avgCreditsPerSem,
      requiredSGPA,
      isAchievable: true,
      statusType: 'challenging',
      explanation: `Demanding goal: You will need an average SGPA of ${requiredSGPA.toFixed(2)} across the next ${remainingSemesters} semesters (near top grades).`,
    };
  }

  return {
    targetCGPA,
    remainingSemesters,
    avgCreditsPerSem,
    requiredSGPA,
    isAchievable: true,
    statusType: 'possible',
    explanation: `Achievable! You need an average SGPA of ${requiredSGPA.toFixed(2)} in each of the remaining ${remainingSemesters} semesters.`,
  };
}

export function validateScaleEntries(entries: Partial<Grade>[]): {
  valid: boolean;
  entries: Grade[];
  errors: string[];
} {
  const errors: string[] = [];
  const labels = new Set<string>();
  const clean: Grade[] = [];

  for (const [index, entry] of entries.entries()) {
    const label = String(entry.label ?? '').trim().toUpperCase();
    const point = Number(entry.point);

    if (!label) {
      errors.push(`Row ${index + 1}: add a grade label.`);
    } else if (label.length > 5) {
      errors.push(`Row ${index + 1}: use no more than 5 characters for label.`);
    } else if (labels.has(label)) {
      errors.push(`Grade label "${label}" is duplicated.`);
    } else if (!Number.isFinite(point) || point < 0 || point > 10) {
      errors.push(`Row ${index + 1}: grade point must be a number between 0 and 10.`);
    } else {
      labels.add(label);
      clean.push({ label, point });
    }
  }

  if (!clean.length) {
    errors.push('Add at least one complete grade to the scale.');
  }

  return { valid: errors.length === 0, entries: clean, errors };
}

export const displayGrade = (value: number | null | undefined): string =>
  value === null || value === undefined || !Number.isFinite(value) ? '—' : value.toFixed(2);

export function convertToPercentage(cgpa: number | null, scaleId: string, maxScale: number = 10): string {
  if (cgpa === null || !Number.isFinite(cgpa)) return '—';
  if (scaleId === 'vtu') {
    // VTU official formula: Percentage = (CGPA - 0.75) * 10
    const pct = Math.max(0, (cgpa - 0.75) * 10);
    return `${pct.toFixed(2)}% (VTU)`;
  }
  if (scaleId === 'mumbai-univ') {
    // Mumbai University formula: 7.1 * CGPA + 11 (if CGPA < 7) else 7.4 * CGPA + 12
    const pct = cgpa >= 7 ? 7.4 * cgpa + 12 : 7.1 * cgpa + 11;
    return `${Math.min(100, Math.max(0, pct)).toFixed(2)}% (MU)`;
  }
  if (scaleId === 'german-scale') {
    // German Inverted formula (Bavarian formula): (1 + 3 * (5 - N) / (5 - 1)) mapped to %: (5 - N)/4 * 100
    const pct = Math.max(0, Math.min(100, ((5.0 - cgpa) / 4.0) * 100));
    return `${pct.toFixed(2)}% (German Equiv)`;
  }
  if (scaleId === 'us-4gpa' || maxScale === 4) {
    const pct = (cgpa / 4) * 100;
    return `${pct.toFixed(2)}%`;
  }
  if (maxScale && maxScale > 0 && maxScale !== 10) {
    return `${((cgpa / maxScale) * 100).toFixed(2)}%`;
  }
  // Generic 10-point standard
  return `${(cgpa * 10).toFixed(2)}%`;
}
