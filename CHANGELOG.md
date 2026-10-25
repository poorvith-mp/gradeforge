# Changelog

All notable changes to GradeForge are documented in this file.

## [2.1.0] - 2026-10-25

### Added
- **16 General Regional & International Grading Scales**: Added Central Universities / 9.5x (`cbse-central-10`), Autonomous Engineering 10-Point (`autonomous-10`), Canada 4.33 GPA (`canada-433`), European ECTS (`ects-europe`), French 20-Point (`french-20`), and Singapore / ASEAN 5.0 CAP (`singapore-5`) alongside existing Indian, North American, European, and Australian presets.
- **Cross-System GPA & Percentage Converter**: Added an interactive bidirectional converter modal (`ConvertModal.tsx` + `src/utils/conversion.ts`) to translate scores across Indian 10-point systems (VTU, Mumbai, UGC, 9.5x), US 4.0, Canada 4.33, German 1.0-5.0, UK Honours, French 20-Point, Australia 7.0, and Singapore 5.0 scales.
- **Custom Scale Editing & Custom Percentage Formulas**: Added an **Edit Scale** button in `ScaleSelector.tsx` and a **Percentage Formula** selector in `CustomScaleModal.tsx` (`CGPA x 10`, `CGPA x 9.5`, `(CGPA - 0.75) x 10`, and proportional `(CGPA / maxScale) x 100`).
- **Quick Scale Search & Region Filter**: Added a live search input in `ScaleSelector.tsx` to filter presets and custom scales by name or region.
- **Persistent Zero-Login Onboarding & Setup Guide**: Upgraded `QuickstartModal.tsx` with local student profile name persistence (`localStorage`), direct Custom Scale creation from Step 1, and a **Setup Guide** button on `CalculatorPage.tsx` to re-open onboarding anytime.
- **Formula Transparency, Printable A4 Summary & Offline PWA**: Added step-by-step worked SGPA numbers (`FormulaPanel.tsx`), compressed URL hash plan sharing (`#plan=`), A4 printable summary (`/print`), and offline service worker precaching.

### Fixed
- Fixed `validateScaleEntries()` and `validateState()` clamping grade points at `10` even when a custom scale configured `maxScale > 10` (now supports `maxScale` up to `100` and preserves `formula` metadata across reloads).

## [1.0.0] - 2026-04-13

### Added
- Initial release of GradeForge with browser-local SGPA & CGPA calculation, Target CGPA Planner, JSON/CSV backup & restore, and multi-university presets.
