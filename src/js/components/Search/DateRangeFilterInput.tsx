import { useCallback, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type { FilterValue } from '@/features/search/types';
import { parseBrackets, buildRangeString, buildComparisonString, DATE_FORMAT, type RangeState } from '@/utils/rangeFilterUtils';

type Props = { value: FilterValue; onChange: (v: FilterValue) => void };

const DateRangeFilterInput = ({ value, onChange }: Props) => {
  const rawValue = Array.isArray(value) ? (value[0] ?? null) : value;

  // Local state buffers what the user is typing. We can't derive from rawValue directly because
  // when only one bound is filled, buildRangeString returns null and the prop resets to null —
  // which would wipe the typed value if we re-derived on every render.
  const [rangeState, setRangeState] = useState<RangeState>(() => {
    const parsed = parseBrackets(rawValue);
    return { ...parsed, lowerOpen: false, upperOpen: false };
  });
  const { lowerStr, upperStr } = rangeState;

  // Track the last value we emitted and the last rawValue we saw, so we can distinguish
  // external prop changes (URL navigation, field reset) from prop changes caused by our own emissions.
  const lastEmittedRef = useRef<string | null | undefined>(undefined);
  const prevRawValueRef = useRef<string | null | undefined>(undefined);

  // Render-time derived-state sync (React recommended pattern for props → state).
  // Only sync when rawValue changed AND the change came from outside (not from our own onChange call).
  if (rawValue !== prevRawValueRef.current) {
    prevRawValueRef.current = rawValue;
    if (rawValue !== lastEmittedRef.current) {
      const parsed = parseBrackets(rawValue);
      setRangeState({ ...parsed, lowerOpen: false, upperOpen: false });
    }
  }

  const emitValue = useCallback(
    (lStr: string, uStr: string) => {
      const lower = lStr ? dayjs(lStr, DATE_FORMAT) : null;
      const upper = uStr ? dayjs(uStr, DATE_FORMAT) : null;
      const inverted = !!(lower?.isValid() && upper?.isValid() && upper.isBefore(lower, 'day'));
      const result = inverted
        ? null
        : (buildRangeString(lStr, uStr, false, false) ?? buildComparisonString(lStr, uStr, false, false));
      lastEmittedRef.current = result;
      onChange(result);
    },
    [onChange]
  );

  const onDateRangeChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      const lStr = dates?.[0]?.format(DATE_FORMAT) ?? '';
      const uStr = dates?.[1]?.format(DATE_FORMAT) ?? '';
      setRangeState((prev) => ({ ...prev, lowerStr: lStr, upperStr: uStr }));
      emitValue(lStr, uStr);
    },
    [emitValue]
  );

  const lowerDateValue = lowerStr ? dayjs(lowerStr, DATE_FORMAT) : null;
  const upperDateValue = upperStr ? dayjs(upperStr, DATE_FORMAT) : null;

  return (
    <DatePicker.RangePicker
      className="w-full"
      format={DATE_FORMAT}
      value={[lowerDateValue?.isValid() ? lowerDateValue : null, upperDateValue?.isValid() ? upperDateValue : null]}
      onChange={onDateRangeChange}
    />
  );
};

export default DateRangeFilterInput;
