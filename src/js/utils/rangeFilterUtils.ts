export const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
export const COMPARISON_RE = /^([<>]|[≥≤])\s*(.+)$/;
export const DATE_FORMAT = 'YYYY-MM-DD';

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

/** Formats a "yyyy-mm" date bin key (e.g. "2021-01") for display in the given language, e.g. "Jan 2021" / "janv. 2021". */
export const formatDateBinKey = (key: string, language: string): string =>
  new Date(key).toLocaleString(language, { year: 'numeric', month: 'short' });

/** Formats a "yyyy-mm" date bin key (e.g. "2021-01") as a compact "MMMYY" label, e.g. "Jan21". */
export const formatDateBinKeyCompact = (key: string, language: string): string =>
  new Intl.DateTimeFormat(language, { year: '2-digit', month: 'short' })
    .formatToParts(new Date(key))
    .filter((p) => p.type === 'month' || p.type === 'year')
    .map((p) => p.value)
    .join('');

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
