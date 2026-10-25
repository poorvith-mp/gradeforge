import React, { useState } from 'react';
import { useGrade } from '../../context/GradeContext';
import { GradingScale, Grade } from '../../types/grade';
import { validateScaleEntries } from '../../utils/calculations';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

interface CustomScaleModalProps {
  onClose: () => void;
  initialScale?: GradingScale;
}

type FormulaPresetKey = 'CGPA × 10' | 'CGPA × 9.5' | '(CGPA − 0.75) × 10' | 'proportional';

function detectInitialFormulaKey(scale?: GradingScale): FormulaPresetKey {
  const pct = scale?.formula?.percentage;
  if (pct === 'CGPA × 9.5') return 'CGPA × 9.5';
  if (pct === '(CGPA − 0.75) × 10') return '(CGPA − 0.75) × 10';
  if (pct === 'CGPA × 10') return 'CGPA × 10';
  if (pct && pct.includes('÷')) return 'proportional';
  if (scale?.maxScale && scale.maxScale !== 10) return 'proportional';
  return 'CGPA × 10';
}

export const CustomScaleModal: React.FC<CustomScaleModalProps> = ({ onClose, initialScale }) => {
  const { saveCustomScale } = useGrade();
  const [name, setName] = useState(initialScale?.name || '');
  const [maxScale, setMaxScale] = useState(initialScale?.maxScale || 10);
  const [formulaKey, setFormulaKey] = useState<FormulaPresetKey>(() => detectInitialFormulaKey(initialScale));
  const [grades, setGrades] = useState<Partial<Grade>[]>(
    initialScale?.grades || [
      { label: 'A+', point: 10 },
      { label: 'A', point: 9 },
      { label: 'B', point: 8 },
      { label: 'C', point: 7 },
      { label: 'D', point: 6 },
      { label: 'F', point: 0 },
    ]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddRow = () => {
    setGrades([...grades, { label: '', point: 0 }]);
  };

  const handleUpdateGrade = (index: number, field: keyof Grade, value: string | number) => {
    const next = [...grades];
    next[index] = { ...next[index], [field]: value };
    setGrades(next);
  };

  const handleRemoveGrade = (index: number) => {
    if (grades.length <= 1) return;
    setGrades(grades.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    const scaleName = name.trim() || 'Custom Grading Scale';
    const numericMax = Math.min(100, Math.max(1, Number(maxScale) || 10));
    const validation = validateScaleEntries(grades, numericMax);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const percentageFormula =
      formulaKey === 'proportional'
        ? `(CGPA ÷ ${numericMax}) × 100`
        : formulaKey;

    const newScale: GradingScale = {
      id: initialScale?.id || `custom-${Date.now()}`,
      name: scaleName,
      maxScale: numericMax,
      isCustom: true,
      description: `Custom ${numericMax}-point scale with ${validation.entries.length} grade definitions.`,
      formula: {
        sgpa: 'SGPA = Σ(credit × grade point) ÷ Σ(credit)',
        cgpa: 'CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)',
        percentage: percentageFormula,
      },
      grades: validation.entries,
    };

    saveCustomScale(newScale);
    onClose();
  };

  const effectiveMax = Math.min(100, Math.max(1, Number(maxScale) || 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-paper border border-gpline shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="custom-scale-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gpline mb-5">
          <h2 id="custom-scale-title" className="text-xl font-serif font-bold text-ink">
            {initialScale ? 'Edit Custom Scale' : 'Create Custom Scale'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-gpmuted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="p-3.5 mb-4 bg-red-50 dark:bg-red-950/40 border border-gpred/40 text-gpred text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4" /> Please correct the following errors:
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
              Scale Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My College 10-Point Scale"
              maxLength={60}
              className="w-full px-3 py-2 border border-gpline bg-bg text-ink rounded-none text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Maximum Scale (1 to 100)
              </label>
              <input
                type="number"
                value={maxScale}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxScale(val);
                  if (val && val !== 10 && formulaKey === 'CGPA × 10') {
                    setFormulaKey('proportional');
                  }
                }}
                min={1}
                max={100}
                step="0.01"
                className="w-full px-3 py-2 border border-gpline bg-bg text-ink rounded-none text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
              />
            </div>

            <div>
              <label
                htmlFor="custom-scale-formula"
                className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5"
              >
                Percentage Formula
              </label>
              <select
                id="custom-scale-formula"
                value={formulaKey}
                onChange={(e) => setFormulaKey(e.target.value as FormulaPresetKey)}
                className="w-full px-3 py-2 border border-gpline bg-bg text-ink rounded-none text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
              >
                <option value="CGPA × 10">CGPA × 10 (Standard 10-pt)</option>
                <option value="CGPA × 9.5">CGPA × 9.5 (Central / 9.5x)</option>
                <option value="(CGPA − 0.75) × 10">(CGPA − 0.75) × 10 (VTU style)</option>
                <option value="proportional">(CGPA ÷ {effectiveMax}) × 100 (Proportional)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-semibold text-ink uppercase tracking-wider">
                Grade Definitions (Label & Points)
              </label>
              <span className="text-[11px] text-gpmuted font-mono">0 to {effectiveMax} points</span>
            </div>

            <div className="space-y-2">
              {grades.map((g, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={g.label || ''}
                    onChange={(e) => handleUpdateGrade(idx, 'label', e.target.value.toUpperCase())}
                    placeholder="e.g. A+"
                    maxLength={5}
                    className="w-1/2 px-3 py-2 border border-gpline bg-bg text-ink font-mono text-sm uppercase rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={effectiveMax}
                    value={g.point ?? ''}
                    onChange={(e) => handleUpdateGrade(idx, 'point', e.target.value)}
                    placeholder="Points"
                    className="w-1/2 px-3 py-2 border border-gpline bg-bg text-ink font-mono text-sm rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGrade(idx)}
                    disabled={grades.length <= 1}
                    className="p-2 border border-gpline bg-paper text-gpred hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Remove grade"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gpline bg-paper hover:bg-gpwash text-ink cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-gpblue" /> Add Grade Row
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gpline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-gpline bg-paper hover:bg-bg text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold border border-gpblue bg-gpblue text-white hover:opacity-90 cursor-pointer"
          >
            Save Scale
          </button>
        </div>
      </div>
    </div>
  );
};
