export const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
export const DATE_FORMAT = 'YYYY-MM-DD';

export type RangeState = { lowerStr: string; upperStr: string; lowerOpen: boolean; upperOpen: boolean };

export const EMPTY_RANGE: RangeState = { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };

export const parseBrackets = (value: string | null): RangeState => {
  if (!value) return EMPTY_RANGE;
  const m = value.match(RANGE_RE);
  if (!m) return EMPTY_RANGE;
  return { lowerOpen: m[1] === '(', lowerStr: m[2], upperStr: m[3], upperOpen: m[4] === ')' };
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
