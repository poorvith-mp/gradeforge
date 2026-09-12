export interface Grade {
  label: string;
  point: number;
}

export interface ScaleFormula {
  sgpa: string;
  cgpa: string;
  percentage?: string;
  note?: string;
}

export interface GradingScale {
  id: string;
  name: string;
  maxScale: number;
  isCustom: boolean;
  grades: Grade[];
  description?: string;
  region?: string;
  formula?: ScaleFormula;
  verifiedAgainst?: string;
  verifiedOn?: string;
}

export interface Subject {
  id: string;
  name: string;
  credits: number | '';
  gradeLabel: string;
}

export interface Semester {
  id: string;
  name?: string;
  subjects: Subject[];
}

export interface GradeState {
  selectedScaleId: string;
  customScales: GradingScale[];
  semesters: Semester[];
  profile?: {
    name?: string;
  };
}

export interface SemesterCalculation {
  semesterId: string;
  sgpa: number | null;
  totalCredits: number;
  weightedPoints: number;
  validSubjectCount: number;
  totalSubjectCount: number;
}

export interface OverallCalculation {
  cgpa: number | null;
  totalCredits: number;
  totalWeightedPoints: number;
  totalSemesters: number;
  totalSubjects: number;
  semesterResults: SemesterCalculation[];
}

export interface TargetPlanResult {
  targetCGPA: number;
  remainingSemesters: number;
  avgCreditsPerSem: number;
  requiredSGPA: number | null;
  isAchievable: boolean;
  statusType: 'achieved' | 'possible' | 'challenging' | 'impossible';
  explanation: string;
}
