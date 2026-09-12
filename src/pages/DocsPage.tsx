import React from 'react';
import { MetaTags } from '../components/seo/MetaTags';
import { HelpCircle, Calculator, CheckCircle2 } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the formula for calculating SGPA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SGPA (Semester Grade Point Average) is calculated as the sum of products of credits and grade points earned in all courses divided by the total credits registered in that semester: SGPA = Σ(Credit × Grade Point) ÷ Σ(Credit).',
        },
      },
      {
        '@type': 'Question',
        name: 'How is CGPA calculated across multiple semesters?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CGPA (Cumulative Grade Point Average) uses the credit-weighted sum across all included subjects in every semester: CGPA = Total Weighted Grade Points ÷ Total Credits Completed across all semesters.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you convert VTU CGPA to equivalent percentage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As per official VTU CBCS regulations, the equivalent percentage is calculated using the formula: Percentage (%) = [CGPA - 0.75] × 10.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does GradeForge store my marks or grades on a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. GradeForge operates entirely browser-locally using HTML5 localStorage. Your courses, credits, and grades never leave your browser and are never transmitted to any external server.',
        },
      },
    ],
  };

  return (
    <>
      <MetaTags
        title="Formulas & Documentation — GradeForge"
        description="Detailed SGPA & CGPA mathematical formulas, university percentage conversion rules (VTU, Anna University), and FAQ."
        canonicalPath="/docs"
        schema={faqSchema}
      />

      <main className="w-[min(1100px,90vw)] mx-auto py-8 sm:py-12">
        <section className="max-w-3xl mb-12">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-gpblue mb-1">
            Documentation & Formulas
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ink tracking-tight mb-6">
            Formulas, schemes & calculation rules.
          </h1>
          <p className="text-gpmuted text-base sm:text-lg leading-relaxed">
            GradeForge follows standard credit-based choice system (CBCS) formulas used by universities worldwide. Here is exactly how your SGPA, CGPA, and equivalent percentages are calculated.
          </p>
        </section>

        {/* SGPA Formula Card */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-gpblue" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink m-0">
              1. SGPA (Semester Grade Point Average)
            </h2>
          </div>
          <p className="text-gpmuted text-sm leading-relaxed mb-4">
            SGPA is the credit-weighted average of grade points earned in a single semester.
          </p>
          <div className="p-4 border-l-4 border-gpgold bg-gpwash/50 font-mono text-sm sm:text-base font-semibold text-ink mb-4">
            SGPA = Σ(Credit × Grade Point) ÷ Σ(Credit)
          </div>
          <ul className="text-xs sm:text-sm text-gpmuted space-y-1.5 pl-4 list-disc">
            <li><strong>Credit:</strong> The credit weight assigned to a theory, lab, or project course (e.g. 4.0, 3.0, 1.5).</li>
            <li><strong>Grade Point:</strong> The numerical value corresponding to the letter grade obtained (e.g. S = 10, A = 9).</li>
            <li>Rows with missing credits, 0 credits, or unassigned grades are automatically excluded from the calculation.</li>
          </ul>
        </section>

        {/* CGPA Formula Card */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-gpblue" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink m-0">
              2. CGPA (Cumulative Grade Point Average)
            </h2>
          </div>
          <p className="text-gpmuted text-sm leading-relaxed mb-4">
            CGPA evaluates your cumulative performance across all completed semesters.
          </p>
          <div className="p-4 border-l-4 border-gpgold bg-gpwash/50 font-mono text-sm sm:text-base font-semibold text-ink mb-4">
            CGPA = Total Weighted Grade Points (All Semesters) ÷ Total Credits (All Semesters)
          </div>
          <p className="text-xs sm:text-sm text-gpmuted leading-relaxed m-0">
            Note: Simple arithmetic average of semester SGPAs is mathematically inaccurate when semesters have unequal credit loads. GradeForge always computes true credit-weighted cumulative averages.
          </p>
        </section>

        {/* Percentage Conversions */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-3xl mb-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mb-4">
            3. Percentage Conversion Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">VTU CBCS (Karnataka)</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = [CGPA - 0.75] × 10</div>
              <p className="text-gpmuted text-xs m-0">Applicable for VTU B.E/B.Tech under CBCS regulations.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">Generic UGC / AICTE 10-Point</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = CGPA × 10 (or 9.5)</div>
              <p className="text-gpmuted text-xs m-0">Commonly used standard across Indian central and state universities.</p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-gpblue" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink m-0">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-gpline/50">
            <div className="pt-4 first:pt-0">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> Are my grades saved if I close the tab?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Yes! GradeForge automatically syncs every course name, credit, and grade into your browser's local storage. When you return on the same device, your work is restored instantly.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> Can I export my grades to Excel or backup to another PC?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Yes! In the calculator, click <strong>"Backup / Export"</strong> to download a JSON file (for complete backup/restore) or a CSV spreadsheet (to open in Microsoft Excel, Google Sheets, or Apple Numbers).
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> Can I install GradeForge and use it offline?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Yes! GradeForge is a Progressive Web App (PWA). Click the "Install" icon in your browser address bar on desktop, or "Add to Home Screen" on Android / iOS. It functions 100% offline with zero internet access required.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> How do shareable plan links work?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Click <strong>"Share Calculator" → "Share My Plan"</strong> to generate a link containing your semesters and grades encoded in the URL hash (<code className="bg-gpwash px-1">#plan=...</code>). All data stays in the browser URL and is never stored on a server. Anyone opening the link sees a read-only preview that they can choose to copy into their calculator.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> How do I get an unofficial printable summary or PDF?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Click <strong>"Printable Summary"</strong> on the calculator page or navigate directly to <code className="bg-gpwash px-1">/print</code>. You can enter your name (stored only locally in your browser) and click "Print / Save as PDF" for a cleanly formatted A4 sheet. Every page includes an official disclaimer watermark.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> How can I add my university to the official presets?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                You can submit an open source Pull Request on GitHub. Follow the guide in <a href="https://github.com/poorvith-mp/gradeforge/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-gpblue underline">CONTRIBUTING.md</a> and provide a link to your university's official academic regulations document.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
