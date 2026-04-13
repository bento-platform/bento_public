import { useCallback, useRef, useState } from 'react';
import { Button, DatePicker, InputNumber, Space } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type { DateField, NumberField } from '@/types/discovery/fieldDefinition';
import type { FilterValue } from '@/features/search/types';

const RANGE_RE = /^([[(])([^,]*),([^,]*)([\])])$/;
const DATE_FORMAT = 'YYYY-MM-DD';

type RangeState = { lowerStr: string; upperStr: string; lowerOpen: boolean; upperOpen: boolean };

const EMPTY_RANGE: RangeState = { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };

const parseBrackets = (value: string | null): RangeState => {
  if (!value) return EMPTY_RANGE;
  const m = value.match(RANGE_RE);
  if (!m) return EMPTY_RANGE;
  return { lowerOpen: m[1] === '(', lowerStr: m[2], upperStr: m[3], upperOpen: m[4] === ')' };
};

const buildRangeString = (
  lowerStr: string,
  upperStr: string,
  lowerOpen: boolean,
  upperOpen: boolean
): string | null => {
  if (!lowerStr || !upperStr) return null;
  return `${lowerOpen ? '(' : '['}${lowerStr},${upperStr}${upperOpen ? ')' : ']'}`;
};

type RangeFilterInputProps = {
  definition: NumberField | DateField;
  value: FilterValue;
  onChange: (v: FilterValue) => void;
};

const RangeFilterInput = ({ definition, value, onChange }: RangeFilterInputProps) => {
  const rawValue = Array.isArray(value) ? (value[0] ?? null) : value;

  // Local state buffers what the user is typing. We can't derive from rawValue directly because
  // when only one bound is filled, buildRangeString returns null and the prop resets to null —
  // which would wipe the typed value if we re-derived on every render.
  const [rangeState, setRangeState] = useState<RangeState>(() => parseBrackets(rawValue));
  const { lowerStr, upperStr, lowerOpen, upperOpen } = rangeState;

  // Track the last value we emitted and the last rawValue we saw, so we can distinguish
  // external prop changes (URL navigation, field reset) from prop changes caused by our own emissions.
  const lastEmittedRef = useRef<string | null | undefined>(undefined);
  const prevRawValueRef = useRef<string | null | undefined>(undefined);

  // Render-time derived-state sync (React recommended pattern for props → state).
  // Only sync when rawValue changed AND the change came from outside (not from our own onChange call).
  if (rawValue !== prevRawValueRef.current) {
    prevRawValueRef.current = rawValue;
    if (rawValue !== lastEmittedRef.current) {
      setRangeState(parseBrackets(rawValue));
    }
  }

  const isNumber = definition.datatype === 'number';

  const emitValue = useCallback(
    (lStr: string, uStr: string, lo: boolean, uo: boolean) => {
      let inverted: boolean;
      if (isNumber) {
        inverted = !!lStr && !!uStr && parseFloat(uStr) < parseFloat(lStr);
      } else {
        const lower = lStr ? dayjs(lStr, DATE_FORMAT) : null;
        const upper = uStr ? dayjs(uStr, DATE_FORMAT) : null;
        inverted = !!(lower?.isValid() && upper?.isValid() && upper.isBefore(lower, 'day'));
      }
      const result = inverted ? null : buildRangeString(lStr, uStr, lo, uo);
      lastEmittedRef.current = result;
      onChange(result);
    },
    [isNumber, onChange]
  );

  const onLowerBracketToggle = useCallback(() => {
    const next = !lowerOpen;
    setRangeState((prev) => ({ ...prev, lowerOpen: next }));
    emitValue(lowerStr, upperStr, next, upperOpen);
  }, [lowerOpen, lowerStr, upperStr, upperOpen, emitValue]);

  const onUpperBracketToggle = useCallback(() => {
    const next = !upperOpen;
    setRangeState((prev) => ({ ...prev, upperOpen: next }));
    emitValue(lowerStr, upperStr, lowerOpen, next);
  }, [upperOpen, lowerStr, upperStr, lowerOpen, emitValue]);

  const onLowerNumberChange = useCallback(
    (v: number | null) => {
      const s = v != null ? String(v) : '';
      setRangeState((prev) => ({ ...prev, lowerStr: s }));
      emitValue(s, upperStr, lowerOpen, upperOpen);
    },
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperNumberChange = useCallback(
    (v: number | null) => {
      const s = v != null ? String(v) : '';
      setRangeState((prev) => ({ ...prev, upperStr: s }));
      emitValue(lowerStr, s, lowerOpen, upperOpen);
    },
    [lowerStr, lowerOpen, upperOpen, emitValue]
  );

  const onLowerDateChange = useCallback(
    (v: Dayjs | null) => {
      const s = v?.format(DATE_FORMAT) ?? '';
      setRangeState((prev) => ({ ...prev, lowerStr: s }));
      emitValue(s, upperStr, lowerOpen, upperOpen);
    },
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperDateChange = useCallback(
    (v: Dayjs | null) => {
      const s = v?.format(DATE_FORMAT) ?? '';
      setRangeState((prev) => ({ ...prev, upperStr: s }));
      emitValue(lowerStr, s, lowerOpen, upperOpen);
    },
    [lowerStr, lowerOpen, upperOpen, emitValue]
  );

  const lowerDateValue = lowerStr ? dayjs(lowerStr, DATE_FORMAT) : null;
  const upperDateValue = upperStr ? dayjs(upperStr, DATE_FORMAT) : null;

  const lowerNum = isNumber && lowerStr ? parseFloat(lowerStr) : null;
  const upperNum = isNumber && upperStr ? parseFloat(upperStr) : null;
  const boundsInverted = isNumber
    ? lowerNum !== null && upperNum !== null && upperNum < lowerNum
    : !!(lowerDateValue?.isValid() && upperDateValue?.isValid() && upperDateValue.isBefore(lowerDateValue, 'day'));

  return (
    <Space.Compact className="flex-1">
      <Button onClick={onLowerBracketToggle}>{lowerOpen ? '(' : '['}</Button>
      {isNumber ? (
        <InputNumber
          className="flex-1"
          style={{ width: '100%' }}
          controls={false}
          value={lowerStr ? parseFloat(lowerStr) : null}
          onChange={onLowerNumberChange}
          placeholder="min"
        />
      ) : (
        <DatePicker
          className="flex-1"
          style={{ width: '100%' }}
          format={DATE_FORMAT}
          value={lowerDateValue?.isValid() ? lowerDateValue : null}
          onChange={onLowerDateChange}
          placeholder="start"
          disabledDate={(d) => !!(upperDateValue?.isValid() && d.isAfter(upperDateValue, 'day'))}
        />
      )}
      <Button disabled>–</Button>
      {isNumber ? (
        <InputNumber
          className="flex-1"
          style={{ width: '100%' }}
          controls={false}
          status={boundsInverted ? 'error' : undefined}
          value={upperStr ? parseFloat(upperStr) : null}
          onChange={onUpperNumberChange}
          placeholder="max"
        />
      ) : (
        <DatePicker
          className="flex-1"
          style={{ width: '100%' }}
          format={DATE_FORMAT}
          status={boundsInverted ? 'error' : undefined}
          value={upperDateValue?.isValid() ? upperDateValue : null}
          onChange={onUpperDateChange}
          placeholder="end"
          disabledDate={(d) => !!(lowerDateValue?.isValid() && d.isBefore(lowerDateValue, 'day'))}
        />
      )}
      <Button onClick={onUpperBracketToggle}>{upperOpen ? ')' : ']'}</Button>
    </Space.Compact>
  );
};

export default RangeFilterInput;
