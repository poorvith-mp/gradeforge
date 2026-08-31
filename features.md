# features.md — International Grading Systems & Cross-System GPA Converter

| Field | Value |
|---|---|
| **Feature** | 15+ country grading scales + GPA conversion tool |
| **Scope** | **MAJOR** |
| **Target version** | 3.0.0 |
| **Date** | 2026-08-20 |
| **Author** | Poorvith M P |
| **Goes to** | Codex |

---

## 1. What exists today

GradeForge supports 7 grading scale presets defined in `src/constants/presets.ts` — 6 Indian university scales (VTU CBCS, Anna University, Mumbai University, KTU, JNTU, generic 10-point) and 1 US 4.0 GPA scale. Each preset is a `GradingScale` object with `id`, `name`, `maxScale`, `grades: { label, point }[]`, and optional `description`. The calculator computes SGPA/CGPA using credit-weighted averages via `src/utils/calculations.ts`. Users can create custom scales via `CustomScaleModal`. A `convertToPercentage` function exists but is hardcoded to VTU's formula only. The `ScaleSelector` component shows all presets in a flat list with no grouping.

## 2. What changes

Two additions:

**A. International grading scale presets** — GradeForge ships with 20+ presets covering major grading systems worldwide, organized by region. The `ScaleSelector` groups scales under region headers (South Asia, Europe, North America, Oceania, East Asia) instead of a flat list. Each scale includes a `country` field and an optional `conversionNote` explaining how the system maps to other standards.

New scales to add:

| Region | System | Max | Notes |
|---|---|---|---|
| **South Asia** | *(existing 6 Indian scales)* | 10 | Already supported |
| | Bangladesh National University | 4.0 | Letter grades A+ through F |
| | Sri Lanka UGC | 4.0 | First Class / Second Upper / etc. |
| | Nepal Tribhuvan University | 4.0 | Percentage-based with GPA mapping |
| **Europe** | UK Honours Classification | — | First / 2:1 / 2:2 / Third / Fail (percentage-based, no GPA) |
| | ECTS (European Credit Transfer) | — | A–F scale, percentile-rank based |
| | German Grading | 5.0 | 1.0 (best) to 5.0 (fail) — inverted scale |
| | French Grading | 20 | 0–20 scale, 10 is passing |
| **North America** | US 4.0 GPA | 4.0 | Already supported |
| | US 4.0 with +/− | 4.3 | A+ = 4.3 variant used by many US universities |
| | Canada Ontario | 4.0 | A+ through F, differs from US in thresholds |
| | Canada Quebec (R-score) | — | Informational only, calculated differently |
| **Oceania** | Australia WAM | 100 | Weighted Average Mark, percentage-based |
| | Australia GPA (7-point) | 7.0 | HD/D/C/P/F used by most Australian universities |
| | New Zealand GPA | 9.0 | A+ = 9, used by NZQA |
| **East Asia** | Japan GPA | 4.0 | S/A/B/C/F scale |
| | South Korea | 4.5 | A+ = 4.5 scale |
| | Singapore NUS | 5.0 | A+ = 5.0 CAP system |

**B. Cross-system GPA converter** — a new page/modal (`/converter` or `ConvertModal`) where the user enters a GPA value and source system, and sees the equivalent in every other system. Conversion uses published equivalence tables from WES (World Education Services) and official university guidelines where available. Where no official mapping exists, the converter shows "No official equivalence — approximate only" with a disclaimer.

The converter is bidirectional: "My VTU 8.2 in US 4.0" and "My US 3.5 in VTU 10-point" both work.

## 3. Why now

GradeForge's traffic is almost entirely Indian students. Students applying to universities abroad (US, UK, Germany, Australia, Canada) are the highest-intent audience and they need two things: (1) their home GPA calculated correctly, and (2) that GPA translated to the target country's system. Every existing converter is ad-infested, inaccurate, or requires sign-up. Adding international scales + conversion makes GradeForge the go-to tool for this workflow and expands the addressable audience from Indian students to students globally.

## 4. Acceptance criteria

### International scales
- [ ] `presets.ts` contains at least 20 grading scale presets covering South Asia, Europe, North America, Oceania, and East Asia.
- [ ] Each preset has `id`, `name`, `country`, `region`, `maxScale`, `grades[]`, and optional `description` and `conversionNote`.
- [ ] `ScaleSelector` groups presets by region with collapsible section headers.
- [ ] Searching/filtering scales by name or country works in the selector.
- [ ] All existing Indian presets continue to work identically — no regression.
- [ ] Percentage-based systems (UK, Australia WAM, France) calculate correctly using their native scale, not a forced 10-point mapping.
- [ ] Inverted scales (German 1.0–5.0 where lower is better) display correctly — the UI does not show a low German GPA as "poor".
- [ ] Systems without numeric GPA (UK Honours, ECTS) show classification labels (e.g., "Upper Second Class (2:1)") instead of a number in the results summary.
- [ ] Custom scale creation still works and custom scales appear under a "Custom" region group.
- [ ] The `DiscoverySurvey` component (if it asks about university) can suggest a preset based on country selection.

### GPA converter
- [ ] A converter is accessible from the calculator page (as a modal or dedicated route).
- [ ] User selects a source system, enters a GPA value, and sees conversions to all other systems.
- [ ] Conversions to percentage-based systems (UK, France, Australia WAM) show a percentage range, not a single number.
- [ ] Conversions where no official equivalence exists are marked "Approximate" with a visible disclaimer.
- [ ] Invalid input (GPA above max scale, negative values) shows a validation error.
- [ ] The converter works standalone — the user does not need to have semesters entered in the calculator to use it.
- [ ] Conversion sources are cited (e.g., "Based on WES equivalence tables").

## 5. Out of scope

- University-specific rules beyond the grading scale (attendance requirements, grace marks, internal/external weightings, rounding rules).
- Automatic university detection from user's location or IP.
- Backend or API — all conversion logic runs client-side.
- Transcript verification or official document generation.
- Credit system differences (ECTS credits vs US credit hours vs Indian credits) — the calculator treats all credits as equivalent weights.
- Canada Quebec R-score calculation (requires CEGEP cohort data not available client-side).

## 6. Files expected to change

### New files
```
src/constants/
  scales/
    south-asia.ts           # Indian + Bangladesh + Sri Lanka + Nepal presets
    europe.ts               # UK, ECTS, German, French presets
    north-america.ts        # US, Canada presets
    oceania.ts              # Australia, New Zealand presets
    east-asia.ts            # Japan, South Korea, Singapore presets
    index.ts                # aggregates all regions, re-exports flat + grouped
src/utils/
  conversion.ts             # cross-system GPA conversion logic + equivalence tables
src/components/calculator/
  ConvertModal.tsx           # GPA converter UI
  ScaleRegionGroup.tsx       # collapsible region group for ScaleSelector
```

### Modified files
```
src/constants/presets.ts    # refactored to import from scales/ submodules
src/types/grade.ts          # add country, region, conversionNote to GradingScale type
src/components/calculator/
  ScaleSelector.tsx          # grouped layout with search, uses ScaleRegionGroup
  ResultsSummary.tsx         # handle classification-based systems (UK, ECTS) alongside numeric GPA
  CustomScaleModal.tsx       # add country/region fields to custom scale form
src/utils/calculations.ts   # handle inverted scales (German) and percentage-based systems
src/pages/CalculatorPage.tsx # add converter modal trigger
```

## 7. Dependencies

None. All conversion logic is static data and arithmetic — no new packages required.

## 8. Design notes

- **ScaleSelector** — region groups are collapsible accordion sections. The currently selected scale's region starts expanded. A search input at the top filters across all regions. Each scale row shows the country flag emoji, scale name, and max scale value.
- **ConvertModal** — two-column layout on desktop, stacked on mobile. Left: source system dropdown + GPA input. Right: conversion results as a card list, one card per target system showing the converted value and confidence label (Official / Approximate). Cards for the user's currently selected scale are highlighted.
- **ResultsSummary** — for classification-based systems, replace the numeric SGPA/CGPA display with the classification label and a descriptor (e.g., "Upper Second Class (2:1) — 60.2%"). The progression chart still works using the underlying percentage.
- Follow existing design system: Tailwind v3 utility classes, Lucide icons, dark/light theme support via ThemeContext.

## 9. Implementation steps

1. **Extend types** — add `country: string`, `region: string`, `conversionNote?: string`, and `scaleType: 'gpa' | 'percentage' | 'classification'` to `GradingScale` in `types/grade.ts`.
2. **Build scale data files** — create `src/constants/scales/` with one file per region. Move existing Indian presets into `south-asia.ts`. Add all new presets with verified grade point mappings from official university documentation.
3. **Refactor presets.ts** — replace inline preset array with aggregated import from `scales/index.ts`. Ensure backward compatibility (same IDs for existing presets so saved user data still resolves).
4. **Update ScaleSelector** — build `ScaleRegionGroup` component. Refactor `ScaleSelector` to render grouped layout with search/filter. Test that selecting a scale still works identically.
5. **Update calculations** — modify `calculateSGPA` and `calculateOverall` to handle inverted scales (German: lower is better) and percentage-based systems. Add classification mapping for UK Honours and ECTS.
6. **Update ResultsSummary** — render classification labels for non-numeric systems. Ensure progression chart adapts axis labels.
7. **Build conversion logic** — implement `conversion.ts` with equivalence tables. Each conversion is a function: `convert(value: number, from: GradingScale, to: GradingScale): ConversionResult` where `ConversionResult` includes the value, a confidence level, and source citation.
8. **Build ConvertModal** — implement the converter UI. Wire it into `CalculatorPage` with a trigger button.
9. **Test** — verify all 20+ presets calculate correctly with sample data. Test edge cases: inverted scales, percentage systems, classification boundaries, custom scales in the grouped selector.

## 10. Rollback

- All changes are additive to the preset data and UI. Reverting `presets.ts` to the original inline array and removing the new components restores the previous state.
- No database, no migrations. User's saved data references scale IDs — existing IDs are preserved, so saved semesters continue to resolve.
- The converter is a standalone modal with no side effects on existing calculator state.
