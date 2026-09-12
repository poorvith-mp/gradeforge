# Changelog

All notable changes to `gradeforge` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-09-12

### Added
- **Progressive Web App (PWA) & Full Offline Support**:
  - Hand-crafted `manifest.webmanifest` and service worker (`sw.js`) with zero plugin dependencies.
  - Build-time asset precaching via `scripts/build-sw.mjs`.
  - Cache-first navigation with canonical root fallback for guaranteed offline access.
  - Non-intrusive update notification toast ensuring uninterrupted grade entry.
  - Standard 192px and 512px application icons.
- **Formula Transparency Panel**:
  - Collapsible formula inspector showing SGPA, CGPA, and institution-specific percentage conversion rules.
  - Live step-by-step worked numbers for active semester credits and grade points (`formatWorkedSGPA`).
  - One-click copy button for worked math lines.
  - Mathematical drift verification test against `convertToPercentage`.
- **Preset Provenance & Verification Badges**:
  - Verified regulation badges with direct links to official institution documents (`verifiedAgainst`, `verifiedOn`).
  - Clear community preset indicators for unverified regional scales.
  - Guidelines and schema specifications in `CONTRIBUTING.md` and PR templates for university contributions.
- **Printable Unofficial Summary**:
  - Dedicated `/print` route generating clean, printer-friendly academic summaries formatted for A4.
  - Optional student name stored locally in browser state (`profile.name`).
  - Fixed, unremovable academic disclaimer watermark: *"Self-calculated with GradeForge. Not an official transcript."*
- **Shareable Read-Only Plans**:
  - URL hash serialization (`#plan=`) compressed via `CompressionStream` (with uncompressed `#planr=` fallback).
  - Safe 64 KB payload and 8 000 character length guards.
  - Interactive read-only view with "Copy into my calculator" import flow.
  - Zero-server architecture: all plan data stays strictly within the browser address fragment.

## [2.0.0] - 2026-08-31

### Added
- Complete UI redesign with Tailwind CSS and academic styling tokens.
- Target CGPA Planner modal for multi-semester goal planning.
- Regional grading scale groupings (VTU, Anna University, Mumbai University, KTU, JNTU, US 4.0, UK Honours, German, Australian).
- JSON backup export and import.
- Progression charts visualizing semester-by-semester SGPA trends.
