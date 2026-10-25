import React, { useState } from 'react';
import { useGrade } from '../../context/GradeContext';
import { PRESET_GRADING_SCALES } from '../../constants/presets';
import { convertToAllMajorSystems, convertAcrossSystems } from '../../utils/conversion';
import { X, ArrowLeftRight } from 'lucide-react';

interface ConvertModalProps {
  onClose: () => void;
}

export const ConvertModal: React.FC<ConvertModalProps> = ({ onClose }) => {
  const { state, activeScale, overall } = useGrade();
  const allScales = [...PRESET_GRADING_SCALES, ...state.customScales];

  const [sourceScaleId, setSourceScaleId] = useState<string>(activeScale.id);
  const [targetScaleId, setTargetScaleId] = useState<string>(
    activeScale.id === 'us-4gpa' ? 'vtu' : 'us-4gpa'
  );
  const [inputCgpa, setInputCgpa] = useState<string>(
    overall.cgpa !== null ? overall.cgpa.toFixed(2) : String(activeScale.maxScale * 0.85)
  );

  const sourceScale = allScales.find((s) => s.id === sourceScaleId) || activeScale;
  const targetScale = allScales.find((s) => s.id === targetScaleId) || PRESET_GRADING_SCALES[0];

  const parsedCgpa = parseFloat(inputCgpa);
  const validCgpa = Number.isFinite(parsedCgpa) && parsedCgpa >= 0 ? parsedCgpa : null;

  const directResult = convertAcrossSystems(validCgpa, sourceScale, targetScale);
  const majorSystems = convertToAllMajorSystems(validCgpa, sourceScale);

  const handleSwap = () => {
    const prevSource = sourceScaleId;
    setSourceScaleId(targetScaleId);
    setTargetScaleId(prevSource);
    if (directResult.value !== null) {
      setInputCgpa(directResult.value.toFixed(2));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-paper border border-gpline shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="converter-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gpline mb-5">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-gpblue" />
            <h2 id="converter-modal-title" className="text-xl font-serif font-bold text-ink m-0">
              Cross-System GPA & Percentage Converter
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close converter modal"
            className="p-1 text-gpmuted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gpmuted mb-4">
          Convert your CGPA or GPA across Indian 10-point schemes (VTU, Mumbai, UGC, 9.5x), US 4.0, Canada 4.33, German 1.0–5.0, UK Honours, French 20-point, Australia 7.0, and Singapore 5.0 scales.
        </p>

        {/* Source Input & Target Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-end p-4 border border-gpline bg-gpwash/40 mb-5">
          <div className="sm:col-span-5 space-y-2">
            <label
              htmlFor="converter-source-scale"
              className="block text-[11px] font-mono font-semibold text-ink uppercase tracking-wider"
            >
              Source Grading Scale
            </label>
            <select
              id="converter-source-scale"
              value={sourceScaleId}
              onChange={(e) => setSourceScaleId(e.target.value)}
              className="w-full px-3 py-2 border border-gpline bg-paper text-ink rounded-none text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
            >
              {allScales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Max {s.maxScale})
                </option>
              ))}
            </select>

            <label
              htmlFor="converter-cgpa-input"
              className="block text-[11px] font-mono font-semibold text-ink uppercase tracking-wider pt-1"
            >
              Input Score (Max {sourceScale.maxScale})
            </label>
            <input
              id="converter-cgpa-input"
              type="number"
              step="0.01"
              min="0"
              max={sourceScale.maxScale}
              value={inputCgpa}
              onChange={(e) => setInputCgpa(e.target.value)}
              className="w-full px-3 py-2 border border-gpline bg-paper text-ink font-mono text-sm rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
            />
          </div>

          <div className="sm:col-span-1 flex justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap source and target scales"
              className="p-2 border border-gpline bg-paper hover:bg-gpwash text-gpblue cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-5 space-y-2">
            <label
              htmlFor="converter-target-scale"
              className="block text-[11px] font-mono font-semibold text-ink uppercase tracking-wider"
            >
              Target Grading Scale
            </label>
            <select
              id="converter-target-scale"
              value={targetScaleId}
              onChange={(e) => setTargetScaleId(e.target.value)}
              className="w-full px-3 py-2 border border-gpline bg-paper text-ink rounded-none text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gpgold"
            >
              {allScales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Max {s.maxScale})
                </option>
              ))}
            </select>

            <div className="pt-1">
              <span className="block text-[11px] font-mono font-semibold text-ink uppercase tracking-wider mb-1">
                Converted Equivalent
              </span>
              <div className="px-3 py-2 border border-gpblue bg-paper text-gpblue font-mono font-bold text-sm">
                {directResult.display}
              </div>
            </div>
          </div>
        </div>

        {/* All Major Systems Reference Table */}
        <div>
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-2.5">
            Instant Equivalence Across Global Systems
          </h3>
          <div className="border border-gpline divide-y divide-gpline/60">
            {majorSystems.map((item) => (
              <div
                key={item.systemId}
                className="p-2.5 sm:px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-paper hover:bg-gpwash/30 text-xs"
              >
                <div>
                  <strong className="font-sans text-ink">{item.systemName}</strong>
                  <span className="ml-2 text-[11px] font-mono text-gpmuted">({item.region})</span>
                  <div className="text-[11px] font-mono text-gpmuted">{item.formulaNote}</div>
                </div>
                <span className="font-mono font-bold text-sm text-gpblue shrink-0">
                  {item.valueString}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gpline">
          <span className="text-[11px] font-mono text-gpmuted">
            Note: Always verify specific admission conversion tables required by your target university.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-gpblue bg-gpblue text-white hover:opacity-90 cursor-pointer shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
