import React from 'react';
import { MetaTags } from '../components/seo/MetaTags';
import { PRESET_GRADING_SCALES } from '../constants/presets';
import { HelpCircle, Calculator, CheckCircle2, Globe2, ArrowLeftRight, Sliders } from 'lucide-react';

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
        name: 'How do you convert VTU, Mumbai University, or Central University CGPA to percentage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'VTU CBCS uses Percentage = (CGPA − 0.75) × 10. Mumbai University uses a piecewise formula: (7.1 × CGPA) + 11 for CGPA < 7 and (7.4 × CGPA) + 12 for CGPA ≥ 7. Central Universities and CBSE use CGPA × 9.5, while standard UGC and Autonomous institutions use CGPA × 10.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I create or edit my own custom grading scale in GradeForge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can create and edit custom grading scales with any maximum scale from 1 to 100, define custom letter grades and grade points, and pick your institution’s percentage conversion formula.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does GradeForge store my marks or grades on a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. GradeForge operates 100% browser-locally using HTML5 localStorage. Your courses, credits, custom scales, and grades never leave your browser and require zero login.',
        },
      },
    ],
  };

  const regions = Array.from(new Set(PRESET_GRADING_SCALES.map((s) => s.region || 'Standard')));

  return (
    <>
      <MetaTags
        title="Formulas & Documentation — GradeForge"
        description="Detailed SGPA & CGPA mathematical formulas, 16 regional grading scales, percentage conversion rules (VTU, Mumbai, UGC, 9.5x, German, US 4.0), and FAQ."
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
            GradeForge follows standard Credit-Based Choice System (CBCS) and international GPA formulas across 16 regional presets and customizable scales. Here is how your SGPA, CGPA, percentage equivalents, and cross-system conversions are computed.
          </p>
        </section>

        {/* SGPA Formula Card */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl mb-8">
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
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl mb-8">
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
            Note: A simple arithmetic mean of semester SGPAs is inaccurate when semesters have unequal credit loads. GradeForge always computes true credit-weighted cumulative averages.
          </p>
        </section>

        {/* Percentage Conversions */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl mb-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink mb-4">
            3. Percentage Conversion Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">VTU CBCS (10-Point)</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = (CGPA − 0.75) × 10</div>
              <p className="text-gpmuted text-xs m-0">Official VTU CBCS percentage equivalence formula.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">Mumbai University (Piecewise 10-Point)</strong>
              <div className="font-mono text-gpblue font-bold">if CGPA &lt; 7: 7.1×CGPA + 11 else: 7.4×CGPA + 12</div>
              <p className="text-gpmuted text-xs m-0">Official University of Mumbai CBCS piecewise conversion.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">Central Universities / CBSE (9.5x)</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = CGPA × 9.5</div>
              <p className="text-gpmuted text-xs m-0">Used by CBSE and Indian central universities following the 9.5x multiplier.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">Generic UGC / Autonomous / Anna / KTU / JNTU</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = CGPA × 10</div>
              <p className="text-gpmuted text-xs m-0">Direct 10x multiplier across AICTE, UGC, and autonomous engineering schemes.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">German Inverted Scale (1.0 to 5.0)</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = ((5.0 − CGPA) ÷ 4.0) × 100</div>
              <p className="text-gpmuted text-xs m-0">Modified Bavarian formula where 1.0 is the highest grade and 4.0 is the passing threshold.</p>
            </div>

            <div className="p-4 border border-gpline bg-bg/40 space-y-2">
              <strong className="text-ink font-sans text-sm block">International Proportional Scales (4.0, 4.33, 5.0, 7.0, 20)</strong>
              <div className="font-mono text-gpblue font-bold">Percentage (%) = (CGPA ÷ MaxScale) × 100</div>
              <p className="text-gpmuted text-xs m-0">Proportional scaling for US 4.0, Canada 4.33, European ECTS, French 20-Point, Australia 7.0, and Singapore 5.0.</p>
            </div>
          </div>
        </section>

        {/* All 16 Built-in Regional Grading Scales */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-5 h-5 text-gpblue" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink m-0">
              4. Supported Regional & International Grading Scales ({PRESET_GRADING_SCALES.length} Presets)
            </h2>
          </div>
          <p className="text-gpmuted text-sm leading-relaxed mb-6">
            GradeForge includes {PRESET_GRADING_SCALES.length} general presets across India, North America, UK & Europe, and Australia & Asia-Pacific. You can filter scales by name or region directly in the calculator.
          </p>

          <div className="space-y-6">
            {regions.map((region) => (
              <div key={region}>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gpblue border-b border-gpline pb-1.5 mb-3">
                  {region} Systems
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {PRESET_GRADING_SCALES.filter((s) => (s.region || 'Standard') === region).map((scale) => (
                    <div key={scale.id} className="p-3.5 border border-gpline bg-bg/30">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <strong className="text-sm font-sans text-ink">{scale.name}</strong>
                        <span className="text-[11px] font-mono text-gpblue bg-gpwash px-2 py-0.5 border border-gpline">
                          Max: {scale.maxScale} · % Formula: {scale.formula?.percentage || 'CGPA × 10'}
                        </span>
                      </div>
                      <p className="text-xs text-gpmuted mb-2">{scale.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scale.grades.map((g) => (
                          <span
                            key={g.label}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-paper border border-gpline text-[11px] font-mono text-ink"
                          >
                            <strong className="text-gpblue">{g.label}</strong>={g.point}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Scales & Cross-System Converter */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-5 h-5 text-gpblue" />
                <h2 className="text-lg sm:text-xl font-serif font-bold text-ink m-0">
                  5. Custom Scale Builder & Editor
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gpmuted leading-relaxed m-0">
                If your institution uses a custom point mapping, click <strong>"New Scale"</strong> (or <strong>"Edit Scale"</strong> when a custom scale is active). You can set any maximum scale from 1 to 100, add or edit grade labels and points, and select your percentage conversion formula (<code className="bg-gpwash px-1">CGPA × 10</code>, <code className="bg-gpwash px-1">CGPA × 9.5</code>, <code className="bg-gpwash px-1">(CGPA − 0.75) × 10</code>, or proportional).
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight className="w-5 h-5 text-gpblue" />
                <h2 className="text-lg sm:text-xl font-serif font-bold text-ink m-0">
                  6. Cross-System GPA Converter
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gpmuted leading-relaxed m-0">
                Preparing for graduate admissions abroad? Click <strong>"Cross-Scale Converter"</strong> in the Results Summary toolbar to convert any CGPA or GPA across Indian 10-point systems, US 4.0, Canada 4.33, German 1.0–5.0 (Modified Bavarian), UK Honours (1st / 2:1 / 2:2), French 20-Point, Australia 7.0, and Singapore 5.0 CAP.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="p-6 sm:p-8 border border-gpline bg-paper max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-gpblue" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink m-0">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-gpline/50">
            <div className="pt-4 first:pt-0">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> Are my grades and onboarding preferences saved if I close the tab?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Yes! GradeForge requires zero login and automatically syncs your profile name, selected grading scale, custom scales, and semester subjects into your browser's <code className="bg-gpwash px-1">localStorage</code>. You can re-open the setup wizard anytime using the <strong>"Setup Guide"</strong> button.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> Can I export my grades to Excel or backup to another PC?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                Yes! In the calculator, click <strong>"Backup / Export"</strong> to download a JSON file (for complete backup/restore including custom scales) or a CSV spreadsheet (to open in Microsoft Excel, Google Sheets, or Apple Numbers).
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
                <CheckCircle2 className="w-4 h-4 text-gpblue shrink-0" /> How can I add a regional grading scheme to the official presets?
              </h3>
              <p className="text-gpmuted text-xs sm:text-sm leading-relaxed m-0 pl-5">
                You can submit an open source Pull Request on GitHub. Follow the guide in <a href="https://github.com/poorvith-mp/gradeforge/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-gpblue underline">CONTRIBUTING.md</a> and provide a link to the official academic regulations document.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
