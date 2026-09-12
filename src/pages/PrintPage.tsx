import React, { useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { buildPrintModel, PRINT_WATERMARK } from '../utils/printModel';
import type { GradeState } from '../types/grade';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';

export const PrintPage: React.FC = () => {
  const [state, setState] = useState<GradeState>(() => loadState());
  const [studentName, setStudentName] = useState<string>(state.profile?.name || '');

  useEffect(() => {
    // When student name changes, persist locally
    const updated: GradeState = {
      ...state,
      profile: studentName.trim() ? { name: studentName.trim() } : undefined,
    };
    saveState(updated);
    setState(updated);
  }, [studentName]);

  const model = buildPrintModel(state);

  if (model.empty) {
    return (
      <main className="min-h-screen bg-bg text-ink p-6 flex flex-col items-center justify-center font-sans">
        <div className="max-w-md w-full bg-paper border border-gpline p-6 text-center space-y-4">
          <h1 className="text-xl font-serif font-bold text-ink">No Academic Records Found</h1>
          <p className="text-sm text-gpmuted font-mono">
            There are no entered semesters or valid grade calculations in your local browser session.
          </p>
          <a
            href="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gpblue bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Calculator
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink font-sans p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Screen toolbar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden bg-paper p-4 border border-gpline">
        <div className="flex items-center gap-3">
          <a
            href="/calculator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gpmuted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Calculator
          </a>
          <span className="text-gpline">|</span>
          <span className="text-xs font-mono text-gpmuted">Printable Unofficial Summary</span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gpblue bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Sheet */}
      <article className="max-w-4xl mx-auto bg-paper print:bg-white border border-gpline print:border-none p-6 sm:p-10 shadow-sm print:shadow-none print:p-0">
        {/* Header */}
        <header className="border-b-2 border-ink pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-ink print:text-black m-0">
                Academic Performance Summary
              </h1>
              <p className="text-xs font-mono text-gpmuted print:text-gray-600 mt-1">
                Self-computed grade evaluation report · Non-official student document
              </p>
            </div>
            <div className="text-right font-mono text-xs text-gpmuted print:text-gray-600">
              <div>Date: <strong>{model.generatedDate}</strong></div>
              <div className="mt-0.5">Scale: <strong>{model.scaleName}</strong></div>
              <div className="text-[11px] text-emerald-700 print:text-gray-700 flex items-center justify-end gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 inline" /> {model.scaleProvenance}
              </div>
            </div>
          </div>

          {/* Student Name */}
          <div className="mt-4 pt-3 border-t border-gpline print:border-gray-300 flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-gpmuted print:text-gray-600 font-bold">Student Name:</span>
            <div className="print:hidden flex-1 max-w-sm">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name (optional, stored locally)"
                className="w-full px-2.5 py-1 text-xs font-sans border border-gpline bg-bg text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-gpblue"
              />
            </div>
            <span className="hidden print:inline text-sm font-bold font-serif">
              {studentName.trim() || '—'}
            </span>
          </div>
        </header>

        {/* Semesters List */}
        <div className="space-y-6 mb-8">
          {model.semesters.map((sem) => (
            <section key={sem.id} className="border border-gpline print:border-gray-400 p-4 break-inside-avoid">
              <div className="flex items-center justify-between border-b border-gpline print:border-gray-400 pb-2 mb-3">
                <h2 className="text-sm font-bold font-serif text-ink print:text-black m-0 uppercase tracking-wide">
                  {sem.name}
                </h2>
                <div className="text-xs font-mono text-gpmuted print:text-gray-700 space-x-3">
                  <span>Credits: <strong>{sem.totalCredits}</strong></span>
                  <span>SGPA: <strong className="text-gpblue print:text-black">{sem.sgpa !== null ? sem.sgpa.toFixed(2) : '—'}</strong></span>
                </div>
              </div>

              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-gpline print:border-gray-300 text-gpmuted print:text-gray-600 uppercase text-[10px]">
                    <th className="py-1.5 pr-4">Subject</th>
                    <th className="py-1.5 px-3 text-center">Credits</th>
                    <th className="py-1.5 px-3 text-center">Grade</th>
                    <th className="py-1.5 pl-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((sub) => (
                    <tr key={sub.id} className="border-b border-gpline/40 print:border-gray-200">
                      <td className="py-1.5 pr-4 font-sans text-ink print:text-black">{sub.name}</td>
                      <td className="py-1.5 px-3 text-center">{sub.credits !== '' ? sub.credits : '—'}</td>
                      <td className="py-1.5 px-3 text-center font-bold text-gpblue print:text-black">{sub.gradeLabel || '—'}</td>
                      <td className="py-1.5 pl-3 text-right">{sub.gradePoint !== null ? sub.gradePoint : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        {/* Overall Results Block */}
        <section className="border-2 border-ink print:border-black p-5 bg-gpwash/30 print:bg-transparent mb-8 break-inside-avoid">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gpmuted print:text-gray-600 font-bold mb-3">
            Cumulative Academic Standing
          </h2>
          <div className="grid grid-cols-3 gap-4 font-mono text-center">
            <div className="p-3 bg-paper print:bg-transparent border border-gpline print:border-gray-400">
              <span className="text-[10px] uppercase text-gpmuted print:text-gray-600 block">Overall CGPA</span>
              <span className="text-2xl font-serif font-bold text-gpblue print:text-black mt-1 block">
                {model.cgpa !== null ? model.cgpa.toFixed(2) : '—'}
              </span>
            </div>
            <div className="p-3 bg-paper print:bg-transparent border border-gpline print:border-gray-400">
              <span className="text-[10px] uppercase text-gpmuted print:text-gray-600 block">Total Credits</span>
              <span className="text-2xl font-serif font-bold text-ink print:text-black mt-1 block">
                {model.totalCredits}
              </span>
            </div>
            <div className="p-3 bg-paper print:bg-transparent border border-gpline print:border-gray-400">
              <span className="text-[10px] uppercase text-gpmuted print:text-gray-600 block">Equivalent Percentage</span>
              <span className="text-xl font-serif font-bold text-ink print:text-black mt-1 block">
                {model.percentageString}
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-gpmuted print:text-gray-600 text-center">
            Formula Applied: <strong>{model.percentageFormula}</strong>
          </div>
        </section>

        {/* Unremovable Footer Watermark */}
        <footer className="pt-6 border-t border-gpline print:border-gray-400 text-center text-xs font-mono text-gpmuted print:text-gray-600">
          <p className="m-0 font-bold tracking-wide uppercase text-[11px] text-gpred print:text-gray-700">
            {PRINT_WATERMARK}
          </p>
          <p className="m-0 mt-1 text-[10px]">
            Generated via GradeForge (https://gradeforge.poorvithmp.com) · Fast, private, client-side academic calculations.
          </p>
        </footer>
      </article>

      {/* Print CSS styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};
