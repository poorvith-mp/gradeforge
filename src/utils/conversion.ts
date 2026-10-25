import type { GradingScale } from '../types/grade.ts';
import { convertToPercentage } from './calculations.ts';

export interface CrossSystemConversion {
  systemId: string;
  systemName: string;
  region: string;
  valueString: string;
  numericValue: number | null;
  formulaNote: string;
}

/**
 * Normalizes any CGPA on a source GradingScale into an equivalent percentage (0 to 100).
 */
export function normalizeToPercentage(cgpa: number | null, sourceScale: GradingScale): number | null {
  if (cgpa === null || !Number.isFinite(cgpa) || cgpa < 0) return null;

  const pctStr = convertToPercentage(cgpa, sourceScale, sourceScale.maxScale);
  const parsed = parseFloat(pctStr.replace('%', '').trim());
  if (!Number.isFinite(parsed)) return null;
  return Math.min(100, Math.max(0, parsed));
}

/**
 * Maps an equivalent percentage (0 to 100) into a target GradingScale's CGPA/GPA value.
 */
export function convertPercentageToScale(pct: number | null, targetScale: GradingScale): {
  value: number | null;
  display: string;
  classification?: string;
} {
  if (pct === null || !Number.isFinite(pct)) {
    return { value: null, display: '—' };
  }

  const clampedPct = Math.min(100, Math.max(0, pct));
  const id = targetScale.id;
  const pctFormula = targetScale.formula?.percentage;

  if (id === 'vtu' || pctFormula === '(CGPA − 0.75) × 10') {
    const val = Math.min(10, Math.max(0, clampedPct / 10 + 0.75));
    return { value: Number(val.toFixed(2)), display: `${val.toFixed(2)} / 10` };
  }

  if (id === 'mumbai-univ') {
    // Inverse of MU piecewise: if pct >= 63.8 (CGPA >= 7): (pct - 12)/7.4 else (pct - 11)/7.1
    const val = clampedPct >= 63.8 ? (clampedPct - 12) / 7.4 : Math.max(0, (clampedPct - 11) / 7.1);
    const bounded = Math.min(10, Math.max(0, val));
    return { value: Number(bounded.toFixed(2)), display: `${bounded.toFixed(2)} / 10` };
  }

  if (id === 'cbse-central-10' || pctFormula === 'CGPA × 9.5') {
    const val = Math.min(10, Math.max(0, clampedPct / 9.5));
    return { value: Number(val.toFixed(2)), display: `${val.toFixed(2)} / 10` };
  }

  if (id === 'german-scale') {
    // Inverse Bavarian formula: N = 5.0 - (pct / 100) * 4.0 (1.0 is best, 4.0 is pass, 5.0 is fail)
    const val = Math.min(5.0, Math.max(1.0, 5.0 - (clampedPct / 100) * 4.0));
    const classification =
      val <= 1.5
        ? 'Sehr Gut'
        : val <= 2.5
          ? 'Gut'
          : val <= 3.5
            ? 'Befriedigend'
            : val <= 4.0
              ? 'Ausreichend'
              : 'Nicht Bestanden';
    return {
      value: Number(val.toFixed(2)),
      display: `${val.toFixed(2)} (${classification})`,
      classification,
    };
  }

  if (id === 'uk-honours') {
    const val = (clampedPct / 100) * 4.0;
    const classification =
      clampedPct >= 70
        ? 'First-Class Honours (1st)'
        : clampedPct >= 60
          ? 'Upper Second-Class (2:1)'
          : clampedPct >= 50
            ? 'Lower Second-Class (2:2)'
            : clampedPct >= 40
              ? 'Third-Class Honours (3rd)'
              : 'Fail';
    return {
      value: Number(val.toFixed(2)),
      display: `${classification} (${val.toFixed(2)} / 4.0)`,
      classification,
    };
  }

  const max = targetScale.maxScale && targetScale.maxScale > 0 ? targetScale.maxScale : 10;
  const val = Math.min(max, Math.max(0, (clampedPct / 100) * max));
  return {
    value: Number(val.toFixed(2)),
    display: `${val.toFixed(2)} / ${max}`,
  };
}

/**
 * Converts a CGPA on a source scale directly to a target scale.
 */
export function convertAcrossSystems(
  cgpa: number | null,
  sourceScale: GradingScale,
  targetScale: GradingScale
): {
  percentage: number | null;
  value: number | null;
  display: string;
  classification?: string;
} {
  const pct = normalizeToPercentage(cgpa, sourceScale);
  const converted = convertPercentageToScale(pct, targetScale);
  return {
    percentage: pct !== null ? Number(pct.toFixed(2)) : null,
    ...converted,
  };
}

/**
 * Produces a complete reference table across major international and Indian grading systems.
 */
export function convertToAllMajorSystems(
  cgpa: number | null,
  sourceScale: GradingScale
): CrossSystemConversion[] {
  const pct = normalizeToPercentage(cgpa, sourceScale);
  if (pct === null) return [];

  const usLinear = Math.min(4.0, Math.max(0, (pct / 100) * 4.0));
  const germanVal = Math.min(5.0, Math.max(1.0, 5.0 - (pct / 100) * 4.0));
  const ukClass =
    pct >= 70
      ? '1st (First-Class Honours)'
      : pct >= 60
        ? '2:1 (Upper Second-Class)'
        : pct >= 50
          ? '2:2 (Lower Second-Class)'
          : pct >= 40
            ? '3rd (Third-Class)'
            : 'Fail';
  const vtuVal = Math.min(10.0, Math.max(0, pct / 10 + 0.75));
  const generic10Val = Math.min(10.0, Math.max(0, pct / 10));
  const central95Val = Math.min(10.0, Math.max(0, pct / 9.5));
  const canadaVal = Math.min(4.33, Math.max(0, (pct / 100) * 4.33));
  const ausVal = Math.min(7.0, Math.max(0, (pct / 100) * 7.0));
  const sgVal = Math.min(5.0, Math.max(0, (pct / 100) * 5.0));
  const frenchVal = Math.min(20.0, Math.max(0, (pct / 100) * 20.0));

  return [
    {
      systemId: 'percentage',
      systemName: 'Equivalent Percentage',
      region: 'Global Baseline',
      valueString: `${pct.toFixed(2)}%`,
      numericValue: Number(pct.toFixed(2)),
      formulaNote: `Normalized from ${sourceScale.name}`,
    },
    {
      systemId: 'us-4gpa',
      systemName: 'US 4.0 GPA Scale',
      region: 'North America',
      valueString: `${usLinear.toFixed(2)} / 4.0`,
      numericValue: Number(usLinear.toFixed(2)),
      formulaNote: '(Percentage ÷ 100) × 4.0',
    },
    {
      systemId: 'canada-433',
      systemName: 'Canada 4.33 GPA Scale',
      region: 'North America',
      valueString: `${canadaVal.toFixed(2)} / 4.33`,
      numericValue: Number(canadaVal.toFixed(2)),
      formulaNote: '(Percentage ÷ 100) × 4.33',
    },
    {
      systemId: 'german-scale',
      systemName: 'German Inverted Scale (1.0 - 5.0)',
      region: 'UK & Europe',
      valueString: `${germanVal.toFixed(2)} (1.0 Best)`,
      numericValue: Number(germanVal.toFixed(2)),
      formulaNote: '5.0 − (Percentage ÷ 100) × 4.0 (Bavarian)',
    },
    {
      systemId: 'uk-honours',
      systemName: 'UK Honours Classification',
      region: 'UK & Europe',
      valueString: ukClass,
      numericValue: Number(usLinear.toFixed(2)),
      formulaNote: '≥70% 1st, 60-69% 2:1, 50-59% 2:2, 40-49% 3rd',
    },
    {
      systemId: 'french-20',
      systemName: 'French 20-Point Scale',
      region: 'UK & Europe',
      valueString: `${frenchVal.toFixed(2)} / 20`,
      numericValue: Number(frenchVal.toFixed(2)),
      formulaNote: '(Percentage ÷ 100) × 20',
    },
    {
      systemId: 'generic-10',
      systemName: 'Standard 10-Point CGPA (UGC / Autonomous)',
      region: 'India',
      valueString: `${generic10Val.toFixed(2)} / 10`,
      numericValue: Number(generic10Val.toFixed(2)),
      formulaNote: 'Percentage ÷ 10',
    },
    {
      systemId: 'vtu',
      systemName: 'VTU CBCS 10-Point CGPA',
      region: 'India',
      valueString: `${vtuVal.toFixed(2)} / 10`,
      numericValue: Number(vtuVal.toFixed(2)),
      formulaNote: '(Percentage ÷ 10) + 0.75',
    },
    {
      systemId: 'cbse-central-10',
      systemName: 'Central / 9.5x 10-Point CGPA',
      region: 'India',
      valueString: `${central95Val.toFixed(2)} / 10`,
      numericValue: Number(central95Val.toFixed(2)),
      formulaNote: 'Percentage ÷ 9.5 (capped at 10.0)',
    },
    {
      systemId: 'aus-7gpa',
      systemName: 'Australia 7.0 GPA Scale',
      region: 'Australia & Asia-Pacific',
      valueString: `${ausVal.toFixed(2)} / 7.0`,
      numericValue: Number(ausVal.toFixed(2)),
      formulaNote: '(Percentage ÷ 100) × 7.0',
    },
    {
      systemId: 'singapore-5',
      systemName: 'Singapore 5.0 CAP Scale',
      region: 'Australia & Asia-Pacific',
      valueString: `${sgVal.toFixed(2)} / 5.0`,
      numericValue: Number(sgVal.toFixed(2)),
      formulaNote: '(Percentage ÷ 100) × 5.0',
    },
  ];
}
