import { useCallback, useRef, useState } from 'react';
import { Button, InputNumber, Space } from 'antd';

import type { NumberField } from '@/types/discovery/fieldDefinition';
import type { FilterValue } from '@/features/search/types';
import { parseBrackets, buildRangeString, type RangeState } from './rangeFilterUtils';

type Props = { definition: NumberField; value: FilterValue; onChange: (v: FilterValue) => void };

const NumberRangeFilterInput = ({ definition, value, onChange }: Props) => {
  const { minimum, maximum } = definition.config;
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

  const emitValue = useCallback(
    (lStr: string, uStr: string, lo: boolean, uo: boolean) => {
      const inverted = !!lStr && !!uStr && parseFloat(uStr) < parseFloat(lStr);
      const result = inverted ? null : buildRangeString(lStr, uStr, lo, uo);
      lastEmittedRef.current = result;
      onChange(result);
    },
    [onChange]
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

  const lowerNum = lowerStr ? parseFloat(lowerStr) : null;
  const upperNum = upperStr ? parseFloat(upperStr) : null;
  const boundsInverted = lowerNum !== null && upperNum !== null && upperNum < lowerNum;

  return (
    <Space.Compact className="flex-1">
      <Button onClick={onLowerBracketToggle}>{lowerOpen ? '(' : '['}</Button>
      <InputNumber
        className="flex-1 w-full"
        controls={false}
        value={lowerStr ? parseFloat(lowerStr) : null}
        onChange={onLowerNumberChange}
        placeholder={minimum != null ? String(minimum) : 'min'}
      />
      <span className="range-separator">–</span>
      <InputNumber
        className="flex-1 w-full"
        controls={false}
        status={boundsInverted ? 'error' : undefined}
        value={upperStr ? parseFloat(upperStr) : null}
        onChange={onUpperNumberChange}
        placeholder={maximum != null ? String(maximum) : 'max'}
      />
      <Button onClick={onUpperBracketToggle}>{upperOpen ? ')' : ']'}</Button>
    </Space.Compact>
  );
};

export default NumberRangeFilterInput;
