import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
export const COMPARISON_RE = /^([<>]|[≥≤])\s*(.+)$/;
export const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_BIN_FORMAT = 'MMM YYYY';

export type RangeState = { lowerStr: string; upperStr: string; lowerOpen: boolean; upperOpen: boolean };

export const EMPTY_RANGE: RangeState = { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };

export const parseBrackets = (value: string | null): RangeState => {
  if (!value) return EMPTY_RANGE;
  const m = value.match(RANGE_RE);
  if (m) return { lowerOpen: m[1] === '(', lowerStr: m[2].trim(), upperStr: m[3].trim(), upperOpen: m[4] === ')' };
  const c = value.match(COMPARISON_RE);
  if (c) {
    const [, op, num] = c;
    if (op === '>') return { ...EMPTY_RANGE, lowerStr: num, lowerOpen: true };
    if (op === '≥') return { ...EMPTY_RANGE, lowerStr: num, lowerOpen: false };
    if (op === '<') return { ...EMPTY_RANGE, upperStr: num, upperOpen: true };
    if (op === '≤') return { ...EMPTY_RANGE, upperStr: num, upperOpen: false };
  }
  return EMPTY_RANGE;
};

/** Converts a "MMM YYYY" date bin label (e.g. "Jan 2026") to a closed monthly range string, or null if unparseable. */
export const parseDateBinAsRange = (value: string): string | null => {
  const d = dayjs(value, DATE_BIN_FORMAT, true);
  if (!d.isValid()) return null;
  const start = d.startOf('month').format(DATE_FORMAT);
  const end = d.endOf('month').format(DATE_FORMAT);
  return `[${start},${end}]`;
};

export const buildRangeString = (
  lowerStr: string,
  upperStr: string,
  lowerOpen: boolean,
  upperOpen: boolean
): string | null => {
  if (!lowerStr || !upperStr) return null;
  return `${lowerOpen ? '(' : '['}${lowerStr},${upperStr}${upperOpen ? ')' : ']'}`;
};

export const buildComparisonString = (
  lowerStr: string,
  upperStr: string,
  lowerOpen: boolean,
  upperOpen: boolean
): string | null => {
  if (lowerStr && !upperStr) return `${lowerOpen ? '>' : '≥'} ${lowerStr}`;
  if (!lowerStr && upperStr) return `${upperOpen ? '<' : '≤'} ${upperStr}`;
  return null;
};
