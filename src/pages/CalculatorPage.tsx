import React, { useState, useEffect } from 'react';
import { useGrade } from '../context/GradeContext';
import { MetaTags } from '../components/seo/MetaTags';
import { ScaleSelector } from '../components/calculator/ScaleSelector';
import { SemesterList } from '../components/calculator/SemesterList';
import { ProgressionChart } from '../components/calculator/ProgressionChart';
import { ResultsSummary } from '../components/calculator/ResultsSummary';
import { QuickstartModal } from '../components/onboarding/QuickstartModal';
import { ExportImportModal } from '../components/calculator/ExportImportModal';
import { isOnboardingCompleted } from '../utils/storage';
import { initializeAttribution } from '../utils/attribution';
import { decodePlanFromHash } from '../utils/sharePlan';
import { Sparkles, Eye, AlertCircle } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const {
    state,
    isReadOnly,
    loadSampleData,
    setPreviewState,
    commitPreviewState,
    cancelPreviewState,
  } = useGrade();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [hashError, setHashError] = useState<string>('');

  useEffect(() => {
    // Initialize first-party attribution capture on load
    initializeAttribution();

    // Check URL hash for shared plan
    const hash = window.location.hash;
    if (hash.startsWith('#plan=') || hash.startsWith('#planr=')) {
      decodePlanFromHash(hash).then((res) => {
        if (res.success && res.state) {
          setPreviewState(res.state);
          setHashError('');
        } else {
          setHashError('This link is invalid. Your local calculations are untouched.');
        }
      });
    }

    // Open onboarding modal if user has never visited and has 0 semesters
    if (!isOnboardingCompleted() && state.semesters.length === 0 && !hash.startsWith('#plan')) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCopyPlan = () => {
    if (window.confirm('Copy this shared plan into your calculator? This will replace your current local entries.')) {
      commitPreviewState();
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleDismissShared = () => {
    cancelPreviewState();
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleDismissError = () => {
    setHashError('');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GradeForge Calculator',
    url: 'https://gradeforge.poorvithmp.com/calculator',
    description: 'Enter subjects, credits, and grades to calculate SGPA and CGPA with VTU, Anna University, and custom scales.',
    isPartOf: {
      '@type': 'SoftwareApplication',
      name: 'GradeForge',
      url: 'https://gradeforge.poorvithmp.com/',
    },
  };

  return (
    <>
      <MetaTags
        title="Calculator — GradeForge SGPA and CGPA Calculator"
        description="Enter subjects, credits, and grades to calculate semester SGPA and cumulative CGPA. Features target planning and multi-university presets."
        canonicalPath="/calculator"
        schema={schema}
      />

      <main className="w-[min(1100px,90vw)] mx-auto py-8 sm:py-12">
        {/* Shared Plan Read-Only Banner */}
        {isReadOnly && (
          <aside aria-label="Shared plan read-only notice" className="mb-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Viewing a shared plan (read-only). Copy into my calculator?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyPlan}
                className="px-3 py-1.5 bg-gpblue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Copy into my calculator
              </button>
              <button
                type="button"
                onClick={handleDismissShared}
                className="px-3 py-1.5 bg-paper border border-gpline text-ink text-xs font-bold hover:bg-gpwash transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </aside>
        )}

        {/* Invalid Shared Link Banner */}
        {hashError && (
          <aside aria-label="Invalid shared link warning" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-mono flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gpred shrink-0" />
              <span>{hashError}</span>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-xs font-bold underline hover:opacity-80 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </aside>
        )}

        {/* Page Lead */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-widest text-gpblue mb-1">
                Calculator
              </p>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ink tracking-tight m-0">
                Your academic notebook
              </h1>
            </div>

            {state.semesters.length === 0 && (
              <button
                type="button"
                onClick={loadSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gpline bg-paper hover:bg-gpwash text-ink self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-gpgold" /> Load Sample Data
              </button>
            )}
          </div>
          <p className="text-gpmuted text-sm sm:text-base mt-2 max-w-2xl">
            Verify the selected scale against your institution’s current official grading scheme. Results update live with each keystroke.
          </p>
        </section>

        {/* Scale Selector */}
        <ScaleSelector />

        {/* Semesters & Subjects */}
        <SemesterList />

        {/* Progression & Visual Trend */}
        <ProgressionChart />

        {/* Live Results Card & Actions */}
        <ResultsSummary />

        {/* Onboarding and Import Modals */}
        <QuickstartModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onOpenImport={() => setIsImportOpen(true)}
        />

        {isImportOpen && (
          <ExportImportModal onClose={() => setIsImportOpen(false)} />
        )}
      </main>
    </>
  );
};
