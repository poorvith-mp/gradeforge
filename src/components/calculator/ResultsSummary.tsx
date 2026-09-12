import React, { useState } from 'react';
import { useGrade } from '../../context/GradeContext';
import { displayGrade, convertToPercentage } from '../../utils/calculations';
import { Target, Download, Printer, Trash2, CheckCircle2, Share2 } from 'lucide-react';
import { TargetPlannerModal } from './TargetPlannerModal';
import { ExportImportModal } from './ExportImportModal';
import { ReportCardModal } from './ReportCardModal';
import { ShareModal } from './ShareModal';
import { DiscoverySurvey } from './DiscoverySurvey';

import { FormulaPanel } from './FormulaPanel';

export const ResultsSummary: React.FC = () => {
  const { overall, activeScale, clearAllData } = useGrade();
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <section className="border border-gpline bg-paper p-5 sm:p-6 mb-8 transition-colors" aria-labelledby="results-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gpline mb-5">
        <h2 id="results-title" className="text-xl font-serif font-bold text-ink m-0">
          Live Results Summary
        </h2>
        <span className="text-xs font-mono text-gpmuted">
          Scale: {activeScale.name}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        <div className="p-4 bg-gpwash border border-gpline flex flex-col justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gpmuted block">
            Overall CGPA
          </span>
          <output id="overall-cgpa" className="font-serif font-bold text-3xl sm:text-4xl text-gpblue mt-1">
            {displayGrade(overall.cgpa)}
          </output>
          <span className="text-[11px] font-mono text-gpmuted mt-1">
            Max Scale: {activeScale.maxScale}
          </span>
        </div>

        <div className="p-4 bg-gpwash border border-gpline flex flex-col justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gpmuted block">
            Credits Earned
          </span>
          <output className="font-serif font-bold text-3xl sm:text-4xl text-ink mt-1">
            {overall.totalCredits}
          </output>
          <span className="text-[11px] font-mono text-gpmuted mt-1">
            Across {overall.totalSemesters} {overall.totalSemesters === 1 ? 'semester' : 'semesters'}
          </span>
        </div>

        <div className="p-4 bg-gpwash border border-gpline flex flex-col justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gpmuted block">
            Equivalent Percentage
          </span>
          <output className="font-serif font-bold text-2xl sm:text-3xl text-ink mt-1">
            {convertToPercentage(overall.cgpa, activeScale.id)}
          </output>
          <span className="text-[11px] font-mono text-gpmuted mt-1">
            {activeScale.id === 'vtu' ? 'Formula: (CGPA - 0.75) × 10' : 'Approximate conversion'}
          </span>
        </div>
      </div>

      {/* Formula Transparency & Worked Numbers Panel */}
      <FormulaPanel />

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gpline/60 mb-6">
        <button
          type="button"
          onClick={() => setIsPlannerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gpblue bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Target className="w-3.5 h-3.5" /> Target CGPA Planner
        </button>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gpline bg-paper hover:bg-gpwash text-ink text-xs font-bold transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-gpblue" /> Share Calculator
        </button>

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gpline bg-paper hover:bg-gpwash text-ink text-xs font-bold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-gpblue" /> Backup / Export
        </button>

        <a
          href="/print"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gpline bg-paper hover:bg-gpwash text-ink text-xs font-bold transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-gpblue" /> Printable Summary
        </a>

        {overall.totalSemesters > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all semesters and subjects? This action cannot be undone.')) {
                clearAllData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent hover:border-gpred/40 text-gpred text-xs font-bold transition-colors cursor-pointer ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset All
          </button>
        )}
      </div>

      {/* Discovery Survey */}
      <DiscoverySurvey />

      <div className="flex items-center gap-1.5 text-xs font-mono text-gpmuted">
        <CheckCircle2 className="w-3.5 h-3.5 text-gpblue shrink-0" />
        <span id="calculator-status">
          Live reactive calculation enabled. Entries save automatically to your browser.
        </span>
      </div>

      {/* Modals */}
      {isPlannerOpen && <TargetPlannerModal onClose={() => setIsPlannerOpen(false)} />}
      {isExportOpen && <ExportImportModal onClose={() => setIsExportOpen(false)} />}
      {isReportCardOpen && <ReportCardModal onClose={() => setIsReportCardOpen(false)} />}
      {isShareOpen && <ShareModal onClose={() => setIsShareOpen(false)} />}
    </section>
  );
};
