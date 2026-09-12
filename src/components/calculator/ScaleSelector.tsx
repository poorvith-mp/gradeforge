import React, { useState } from 'react';
import { useGrade } from '../../context/GradeContext';
import { PRESET_GRADING_SCALES } from '../../constants/presets';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { CustomScaleModal } from './CustomScaleModal';

export const ScaleSelector: React.FC = () => {
  const { state, activeScale, setSelectedScaleId, deleteCustomScale } = useGrade();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  return (
    <div className="p-5 border border-gpline bg-paper mb-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="scale-select" className="font-bold text-ink whitespace-nowrap text-sm flex items-center gap-1.5">
            Grading scale
            <span className="text-gpmuted text-xs font-normal" title="Calculations update dynamically when changing grading scales">
              <HelpCircle className="w-3.5 h-3.5 inline text-gpblue" />
            </span>
          </label>
          <select
            id="scale-select"
            value={state.selectedScaleId}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                setIsCustomModalOpen(true);
              } else {
                setSelectedScaleId(e.target.value);
              }
            }}
            className="min-w-[260px] sm:min-w-[320px] px-3 py-2 border border-gpline bg-bg text-ink rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold text-sm"
          >
            {Array.from(new Set(PRESET_GRADING_SCALES.map((s) => s.region || 'Standard'))).map((region) => (
              <optgroup key={region} label={`${region} Systems`}>
                {PRESET_GRADING_SCALES.filter((s) => (s.region || 'Standard') === region).map((scale) => (
                  <option key={scale.id} value={scale.id}>
                    {scale.name}
                  </option>
                ))}
              </optgroup>
            ))}

            {state.customScales.length > 0 && (
              <optgroup label="Your Custom Scales">
                {state.customScales.map((scale) => (
                  <option key={scale.id} value={scale.id}>
                    {scale.name} (Custom)
                  </option>
                ))}
              </optgroup>
            )}

            <option value="__add_new__">+ Create Custom Grading Scale...</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold border border-gpline bg-paper hover:bg-gpwash text-ink transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-gpblue" />
            New Scale
          </button>

          {activeScale.isCustom && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete custom scale "${activeScale.name}"?`)) {
                  deleteCustomScale(activeScale.id);
                }
              }}
              title="Delete this custom scale"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold border border-gpline bg-paper hover:bg-red-50 text-gpred transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Scale
            </button>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
        {activeScale.verifiedAgainst ? (
          <a
            href={activeScale.verifiedAgainst}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 hover:underline"
            title="Verified against official university regulations"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Verified {activeScale.verifiedOn || 'Official'}
          </a>
        ) : activeScale.isCustom ? (
          <span className="font-mono text-gpmuted bg-gpwash px-2 py-0.5 border border-gpline">
            Custom Scale
          </span>
        ) : (
          <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
            Community preset, unverified
          </span>
        )}
        {activeScale.description && (
          <span className="text-gpmuted font-mono">
            {activeScale.description}
          </span>
        )}
      </div>

      {/* Scale breakdown chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-gpline/50">
        <span className="text-[11px] font-mono text-gpmuted uppercase tracking-wider mr-1">Grades:</span>
        {activeScale.grades.map((grade) => (
          <span
            key={grade.label}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gpwash/50 border border-gpline text-[11px] font-mono text-ink rounded-none"
          >
            <strong className="text-gpblue">{grade.label}</strong>
            <span className="text-gpmuted font-normal">= {grade.point}</span>
          </span>
        ))}
      </div>

      {isCustomModalOpen && (
        <CustomScaleModal onClose={() => setIsCustomModalOpen(false)} />
      )}
    </div>
  );
};
