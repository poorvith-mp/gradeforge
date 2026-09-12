import React, { useState, useEffect } from 'react';
import { useGrade } from '../../context/GradeContext';
import { formatWorkedSGPA, getPercentageFormula } from '../../utils/calculations';
import { ChevronDown, ChevronUp, Copy, Check, Calculator } from 'lucide-react';

const STORAGE_KEY_FORMULA_OPEN = 'gradepath_formula_open';

export const FormulaPanel: React.FC = () => {
  const { state, activeScale } = useGrade();
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_FORMULA_OPEN) === 'true';
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORMULA_OPEN, isOpen ? 'true' : 'false');
    } catch {
      // Ignore storage errors
    }
  }, [isOpen]);

  // Find latest semester with at least one valid grade
  const activeSemester = state.semesters.length > 0 ? state.semesters[state.semesters.length - 1] : null;
  const workedLine = activeSemester ? formatWorkedSGPA(activeSemester.subjects, activeScale) : '—';

  const sgpaFormula = activeScale.formula?.sgpa || 'SGPA = Σ(credit × grade point) ÷ Σ(credit)';
  const cgpaFormula = activeScale.formula?.cgpa || 'CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)';
  const percentageFormula = getPercentageFormula(activeScale);

  const handleCopy = () => {
    if (workedLine === '—') return;
    navigator.clipboard.writeText(workedLine).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border border-gpline bg-gpwash/40 p-4 mb-6 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-bold text-ink text-sm cursor-pointer hover:text-gpblue transition-colors"
      >
        <span className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-gpblue" />
          Formula Transparency & Worked Numbers ({activeScale.name})
        </span>
        <span className="text-gpmuted text-xs flex items-center gap-1 font-mono">
          {isOpen ? 'Hide' : 'Show'}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-gpline/60 space-y-3.5 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 bg-paper border border-gpline">
              <span className="text-[10px] uppercase text-gpmuted block font-bold mb-1">SGPA Formula</span>
              <p className="text-ink">{sgpaFormula}</p>
            </div>
            <div className="p-2.5 bg-paper border border-gpline">
              <span className="text-[10px] uppercase text-gpmuted block font-bold mb-1">CGPA Formula</span>
              <p className="text-ink">{cgpaFormula}</p>
            </div>
            <div className="p-2.5 bg-paper border border-gpline">
              <span className="text-[10px] uppercase text-gpmuted block font-bold mb-1">Percentage Rule</span>
              <p className="text-ink">Percentage = {percentageFormula}</p>
            </div>
          </div>

          {activeScale.formula?.note && (
            <p className="text-gpmuted text-[11px] italic bg-paper/60 p-2 border border-gpline/50">
              Note: {activeScale.formula.note}
            </p>
          )}

          {/* Worked numbers for current semester */}
          <div className="p-3 bg-paper border border-gpline flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-gpmuted block font-bold mb-0.5">
                Worked Calculation ({activeSemester?.name || 'Active Semester'})
              </span>
              <p className="text-ink text-sm font-bold tracking-tight">
                {workedLine !== '—' ? workedLine : 'Add credits and grades to view step-by-step numbers'}
              </p>
            </div>
            {workedLine !== '—' && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gpline bg-gpwash hover:bg-paper text-ink text-xs font-bold transition-colors cursor-pointer self-start sm:self-center shrink-0"
                title="Copy worked calculation line"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gpblue" />}
                {copied ? 'Copied' : 'Copy line'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
