import { SwapRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';

export const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
export const COMPARISON_RE = /^([<>]|[≥≤])\s*(.+)$/;
export const DATE_BIN_KEY_RE = /^\d{4}-\d{2}$/;
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
  // Native `new Date("yyyy-mm")` parses date-only strings as UTC, which shifts the displayed month back by one in
  // any UTC-negative timezone once re-rendered in local time. dayjs parses the same string as local time instead.
  dayjs(key).toDate().toLocaleString(language, { year: 'numeric', month: 'short' });

const formatDateValueForDisplay = (dateStr: string): string => {
  const d = dayjs(dateStr, DATE_FORMAT);
  return d.isValid() ? d.format(DATE_FORMAT) : dateStr;
};

/**
 * Formats a raw date filter value (a "yyyy-mm" bin key, a "[lower,upper]"/"(lower,upper)" bracket range, or a
 * "&gt;"/"&lt;"/"≥"/"≤" comparison string) into a human-readable node for display — e.g. in filter pills.
 * Shared with SearchFilterInput (the sidebar's own filter-editing form) so both surfaces show the same labels.
 * Bin keys are localized (e.g. "Jan 2021"); ranges/comparisons use ISO (YYYY-MM-DD) dates for unambiguous display.
 */
export const formatDateFilterValue = (value: string, language: string): ReactNode => {
  if (DATE_BIN_KEY_RE.test(value)) return formatDateBinKey(value, language);

  const rangeMatch = value.match(RANGE_RE);
  if (rangeMatch) {
    const [, , lower, upper] = rangeMatch;
    return (
      <>
        {formatDateValueForDisplay(lower)}
        <SwapRightOutlined style={{ marginInline: 4 }} />
        {formatDateValueForDisplay(upper)}
      </>
    );
  }

  const comparisonMatch = value.match(COMPARISON_RE);
  if (comparisonMatch) {
    const [, op, date] = comparisonMatch;
    return `${op} ${formatDateValueForDisplay(date)}`;
  }

  return value;
};

/**
 * Expands a raw "yyyy-mm" date bin key (as produced by clicking a date-binned chart bar, see Chart.tsx) into the
 * [start, end] of that month, formatted as DATE_FORMAT strings, so a range picker can display it. Returns null if
 * the key isn't a valid bin key.
 */
export const dateBinKeyToRange = (key: string): { lowerStr: string; upperStr: string } | null => {
  if (!DATE_BIN_KEY_RE.test(key)) return null;
  const month = dayjs(key);
  if (!month.isValid()) return null;
  return { lowerStr: month.startOf('month').format(DATE_FORMAT), upperStr: month.endOf('month').format(DATE_FORMAT) };
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
