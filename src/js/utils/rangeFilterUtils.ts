import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
export const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_BIN_FORMAT = 'MMM YYYY';

export type RangeState = { lowerStr: string; upperStr: string; lowerOpen: boolean; upperOpen: boolean };

export const EMPTY_RANGE: RangeState = { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };

export const parseBrackets = (value: string | null): RangeState => {
  if (!value) return EMPTY_RANGE;
  const m = value.match(RANGE_RE);
  if (!m) return EMPTY_RANGE;
  return { lowerOpen: m[1] === '(', lowerStr: m[2], upperStr: m[3], upperOpen: m[4] === ')' };
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
