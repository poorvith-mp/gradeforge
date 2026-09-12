import type { GradeState, GradingScale, Semester } from '../types/grade.ts';
import { PRESET_GRADING_SCALES } from '../constants/presets.ts';

const STORAGE_KEY = 'gradepath_state_v2';
const ONBOARDING_SEEN_KEY = 'gradepath_onboarded';

const bounded = (value: unknown, max = 100): string =>
  typeof value === 'string' ? value.slice(0, max) : '';

export function defaultState(): GradeState {
  return {
    selectedScaleId: 'vtu',
    customScales: [],
    semesters: [],
  };
}

export function validateState(value: unknown): GradeState {
  if (!value || typeof value !== 'object') return defaultState();
  const raw = value as Partial<GradeState>;

  const customScales: GradingScale[] = Array.isArray(raw.customScales)
    ? raw.customScales.slice(0, 15).map((scale) => ({
        id: bounded(scale.id, 80) || `custom-${Date.now()}`,
        name: bounded(scale.name, 60) || 'Custom Scale',
        maxScale: Number(scale.maxScale) || 10,
        isCustom: true,
        description: bounded(scale.description, 150),
        grades: Array.isArray(scale.grades)
          ? scale.grades.slice(0, 30).map((g) => ({
              label: bounded(g.label, 5).toUpperCase(),
              point: Math.min(10, Math.max(0, Number(g.point) || 0)),
            }))
          : [],
      })).filter((scale) => scale.id && scale.name && scale.grades.length > 0)
    : [];

  const semesters: Semester[] = Array.isArray(raw.semesters)
    ? raw.semesters.slice(0, 24).map((sem, idx) => ({
        id: bounded(sem.id, 80) || `sem-${idx + 1}-${Date.now()}`,
        name: bounded(sem.name, 50) || `Semester ${idx + 1}`,
        subjects: Array.isArray(sem.subjects)
          ? sem.subjects.slice(0, 40).map((sub, sIdx) => ({
              id: bounded(sub.id, 80) || `sub-${sIdx + 1}-${Date.now()}`,
              name: bounded(sub.name, 100),
              credits: Number.isFinite(Number(sub.credits)) && Number(sub.credits) > 0
                ? Math.min(30, Number(sub.credits))
                : (sub.credits === '' ? '' : ''),
              gradeLabel: bounded(sub.gradeLabel, 5).toUpperCase(),
            }))
          : [],
      }))
    : [];

  const selectedScaleId = bounded(raw.selectedScaleId, 80) || 'vtu';

  const profile =
    raw.profile && typeof raw.profile === 'object' && typeof raw.profile.name === 'string' && raw.profile.name.trim()
      ? { name: bounded(raw.profile.name.trim(), 100) }
      : undefined;

  return {
    selectedScaleId,
    customScales,
    semesters,
    ...(profile ? { profile } : {}),
  };
}

export function loadState(): GradeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return validateState(JSON.parse(raw));
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return defaultState();
  }
}

export function saveState(state: GradeState): boolean {
  try {
    const validated = validateState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

export function isOnboardingCompleted(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  } catch {
    return true;
  }
}

export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, completed ? 'true' : 'false');
  } catch {
    // Ignore storage issues
  }
}

export function getActiveScale(state: GradeState): GradingScale {
  const custom = state.customScales.find((s) => s.id === state.selectedScaleId);
  if (custom) return custom;

  const preset = PRESET_GRADING_SCALES.find((s) => s.id === state.selectedScaleId);
  if (preset) return preset;

  return PRESET_GRADING_SCALES[0];
}
