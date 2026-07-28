import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, InputNumber, Space, Tooltip } from 'antd';

import type { NumberField } from '@/types/discovery/fieldDefinition';
import type { FilterValue } from '@/features/search/types';
import { useTranslationFn } from '@/hooks';
import { parseBrackets, buildRangeString, buildComparisonString, type RangeState } from '@/utils/rangeFilterUtils';

type Props = { definition: NumberField; value: FilterValue; onChange: (v: FilterValue) => void };

const NumberRangeFilterInput = ({ definition, value, onChange }: Props) => {
  const t = useTranslationFn();
  const { minimum, maximum } = definition.config;
  const enforcedMin =
    'taper_left' in definition.config && minimum === definition.config.taper_left ? undefined : (minimum ?? undefined);
  const enforcedMax =
    'taper_right' in definition.config && maximum === definition.config.taper_right
      ? undefined
      : (maximum ?? undefined);
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
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

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
      const result = inverted
        ? null
        : (buildRangeString(lStr, uStr, lo, uo) ?? buildComparisonString(lStr, uStr, lo, uo));
      lastEmittedRef.current = result;
      onChange(result);
    },
    [onChange]
  );

  // Debounced variant for number inputs — bracket toggles use emitValue directly (discrete actions).
  const emitValueDebounced = useCallback(
    (lStr: string, uStr: string, lo: boolean, uo: boolean) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => emitValue(lStr, uStr, lo, uo), 300);
    },
    [emitValue]
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
      emitValueDebounced(s, upperStr, lowerOpen, upperOpen);
    },
    [upperStr, lowerOpen, upperOpen, emitValueDebounced]
  );

  const onUpperNumberChange = useCallback(
    (v: number | null) => {
      const s = v != null ? String(v) : '';
      setRangeState((prev) => ({ ...prev, upperStr: s }));
      emitValueDebounced(lowerStr, s, lowerOpen, upperOpen);
    },
    [lowerStr, lowerOpen, upperOpen, emitValueDebounced]
  );

  const lowerNum = lowerStr ? parseFloat(lowerStr) : null;
  const upperNum = upperStr ? parseFloat(upperStr) : null;
  const boundsInverted = lowerNum !== null && upperNum !== null && upperNum < lowerNum;

  return (
    <Space.Compact className="w-full">
      <Tooltip
        title={`${t(lowerOpen ? 'search.range.lower_exclusive' : 'search.range.lower_inclusive')} — ${t('search.range.click_to_switch')}`}
      >
        <Button onClick={onLowerBracketToggle}>{lowerOpen ? '(' : '['}</Button>
      </Tooltip>
      <InputNumber
        className="flex-1 w-full"
        controls={false}
        min={enforcedMin}
        value={lowerStr ? parseFloat(lowerStr) : null}
        onChange={onLowerNumberChange}
        placeholder={minimum !== null ? String(minimum) : 'min'}
      />
      <span className="range-separator">–</span>
      <InputNumber
        className="flex-1 w-full"
        controls={false}
        status={boundsInverted ? 'error' : undefined}
        max={enforcedMax}
        value={upperStr ? parseFloat(upperStr) : null}
        onChange={onUpperNumberChange}
        placeholder={maximum !== null ? String(maximum) : 'max'}
      />
      <Tooltip
        title={`${t(upperOpen ? 'search.range.upper_exclusive' : 'search.range.upper_inclusive')} — ${t('search.range.click_to_switch')}`}
      >
        <Button onClick={onUpperBracketToggle}>{upperOpen ? ')' : ']'}</Button>
      </Tooltip>
    </Space.Compact>
  );
};

export default NumberRangeFilterInput;
