import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { GradeState, GradingScale, Semester, Subject, OverallCalculation } from '../types/grade';
import { loadState, saveState, getActiveScale, defaultState } from '../utils/storage';
import { calculateOverall } from '../utils/calculations';
import { SAMPLE_SEMESTERS } from '../constants/sampleData';

interface GradeContextType {
  state: GradeState;
  activeScale: GradingScale;
  overall: OverallCalculation;
  isReadOnly: boolean;
  setSelectedScaleId: (id: string) => void;
  saveCustomScale: (scale: GradingScale) => void;
  deleteCustomScale: (scaleId: string) => void;
  addSemester: (name?: string) => void;
  removeSemester: (semId: string) => void;
  updateSemesterName: (semId: string, name: string) => void;
  duplicateSemester: (semId: string) => void;
  addSubject: (semId: string, name?: string, credits?: number | '', gradeLabel?: string) => void;
  updateSubject: (semId: string, subId: string, updates: Partial<Subject>) => void;
  removeSubject: (semId: string, subId: string) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  importBackupState: (newState: GradeState) => void;
  setPreviewState: (preview: GradeState | null) => void;
  commitPreviewState: () => void;
  cancelPreviewState: () => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GradeState>(() => loadState());
  const [previewState, setPreviewState] = useState<GradeState | null>(null);

  const effectiveState = previewState || state;
  const isReadOnly = Boolean(previewState);

  useEffect(() => {
    if (!previewState) {
      saveState(state);
    }
  }, [state, previewState]);

  const activeScale = useMemo(() => getActiveScale(effectiveState), [effectiveState]);
  const overall = useMemo(() => calculateOverall(effectiveState.semesters, activeScale), [effectiveState.semesters, activeScale]);

  const commitPreviewState = () => {
    if (previewState) {
      setState(previewState);
      saveState(previewState);
      setPreviewState(null);
    }
  };

  const cancelPreviewState = () => {
    setPreviewState(null);
  };

  const setSelectedScaleId = (id: string) => {
    setState((prev) => ({ ...prev, selectedScaleId: id }));
  };

  const saveCustomScale = (newScale: GradingScale) => {
    setState((prev) => {
      const existingIdx = prev.customScales.findIndex((s) => s.id === newScale.id);
      let updatedCustoms: GradingScale[];
      if (existingIdx >= 0) {
        updatedCustoms = [...prev.customScales];
        updatedCustoms[existingIdx] = newScale;
      } else {
        updatedCustoms = [...prev.customScales, newScale];
      }
      return {
        ...prev,
        customScales: updatedCustoms,
        selectedScaleId: newScale.id,
      };
    });
  };

  const deleteCustomScale = (scaleId: string) => {
    setState((prev) => {
      const updatedCustoms = prev.customScales.filter((s) => s.id !== scaleId);
      const newSelected = prev.selectedScaleId === scaleId ? 'vtu' : prev.selectedScaleId;
      return {
        ...prev,
        customScales: updatedCustoms,
        selectedScaleId: newSelected,
      };
    });
  };

  const addSemester = (name?: string) => {
    setState((prev) => {
      const nextNum = prev.semesters.length + 1;
      const newSem: Semester = {
        id: `sem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name || `Semester ${nextNum}`,
        subjects: [
          { id: `sub-${Date.now()}-1`, name: 'Subject 1', credits: 4, gradeLabel: activeScale.grades[0]?.label || 'S' },
          { id: `sub-${Date.now()}-2`, name: 'Subject 2', credits: 4, gradeLabel: activeScale.grades[1]?.label || 'A' },
          { id: `sub-${Date.now()}-3`, name: 'Subject 3', credits: 3, gradeLabel: activeScale.grades[0]?.label || 'S' },
        ],
      };
      return {
        ...prev,
        semesters: [...prev.semesters, newSem],
      };
    });
  };

  const removeSemester = (semId: string) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.filter((s) => s.id !== semId),
    }));
  };

  const updateSemesterName = (semId: string, name: string) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === semId ? { ...s, name } : s)),
    }));
  };

  const duplicateSemester = (semId: string) => {
    setState((prev) => {
      const target = prev.semesters.find((s) => s.id === semId);
      if (!target) return prev;
      const dup: Semester = {
        id: `sem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `${target.name || 'Semester'} (Copy)`,
        subjects: target.subjects.map((sub) => ({
          ...sub,
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        })),
      };
      return {
        ...prev,
        semesters: [...prev.semesters, dup],
      };
    });
  };

  const addSubject = (semId: string, name = '', credits: number | '' = 3, gradeLabel?: string) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => {
        if (s.id !== semId) return s;
        const newSub: Subject = {
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: name || `Subject ${s.subjects.length + 1}`,
          credits: credits,
          gradeLabel: gradeLabel || activeScale.grades[0]?.label || 'S',
        };
        return {
          ...s,
          subjects: [...s.subjects, newSub],
        };
      }),
    }));
  };

  const updateSubject = (semId: string, subId: string, updates: Partial<Subject>) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => {
        if (s.id !== semId) return s;
        return {
          ...s,
          subjects: s.subjects.map((sub) => (sub.id === subId ? { ...sub, ...updates } : sub)),
        };
      }),
    }));
  };

  const removeSubject = (semId: string, subId: string) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => {
        if (s.id !== semId) return s;
        return {
          ...s,
          subjects: s.subjects.filter((sub) => sub.id !== subId),
        };
      }),
    }));
  };

  const loadSampleData = () => {
    setState((prev) => ({
      ...prev,
      selectedScaleId: 'vtu',
      semesters: SAMPLE_SEMESTERS,
    }));
  };

  const clearAllData = () => {
    setState(defaultState());
  };

  const importBackupState = (newState: GradeState) => {
    setState(newState);
  };

  return (
    <GradeContext.Provider
      value={{
        state: effectiveState,
        activeScale,
        overall,
        isReadOnly,
        setSelectedScaleId,
        saveCustomScale,
        deleteCustomScale,
        addSemester,
        removeSemester,
        updateSemesterName,
        duplicateSemester,
        addSubject,
        updateSubject,
        removeSubject,
        loadSampleData,
        clearAllData,
        importBackupState,
        setPreviewState,
        commitPreviewState,
        cancelPreviewState,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
};

export const useGrade = (): GradeContextType => {
  const context = useContext(GradeContext);
  if (!context) {
    throw new Error('useGrade must be used within a GradeProvider');
  }
  return context;
};
