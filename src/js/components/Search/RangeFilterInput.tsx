import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, DatePicker, InputNumber, Space } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type { DateField, NumberField } from '@/types/discovery/fieldDefinition';
import type { FilterValue } from '@/features/search/types';

const RANGE_RE = /^([\[(])([^,]*),([^,]*)([\])])$/;
const DATE_FORMAT = 'YYYY-MM-DD';

const parseBrackets = (value: string | null): { lowerStr: string; upperStr: string; lowerOpen: boolean; upperOpen: boolean } => {
  if (!value) return { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };
  const m = value.match(RANGE_RE);
  if (!m) return { lowerStr: '', upperStr: '', lowerOpen: false, upperOpen: false };
  return {
    lowerOpen: m[1] === '(',
    lowerStr: m[2],
    upperStr: m[3],
    upperOpen: m[4] === ')',
  };
};

const buildRangeString = (lowerStr: string, upperStr: string, lowerOpen: boolean, upperOpen: boolean): string | null => {
  if (!lowerStr && !upperStr) return null;
  return `${lowerOpen ? '(' : '['}${lowerStr},${upperStr}${upperOpen ? ')' : ']'}`;
};

type RangeFilterInputProps = {
  definition: NumberField | DateField;
  value: FilterValue;
  onChange: (v: FilterValue) => void;
};

const RangeFilterInput = ({ definition, value, onChange }: RangeFilterInputProps) => {
  const rawValue = Array.isArray(value) ? (value[0] ?? null) : value;

  const [lowerStr, setLowerStr] = useState('');
  const [upperStr, setUpperStr] = useState('');
  const [lowerOpen, setLowerOpen] = useState(false);
  const [upperOpen, setUpperOpen] = useState(false);

  // Track the last value emitted by this component to avoid re-parsing our own emissions
  const lastEmittedRef = useRef<string | null>(undefined);

  useEffect(() => {
    if (rawValue === lastEmittedRef.current) return;
    const parsed = parseBrackets(rawValue);
    setLowerStr(parsed.lowerStr);
    setUpperStr(parsed.upperStr);
    setLowerOpen(parsed.lowerOpen);
    setUpperOpen(parsed.upperOpen);
  }, [rawValue]);

  const emitValue = useCallback(
    (lStr: string, uStr: string, lo: boolean, uo: boolean) => {
      const result = buildRangeString(lStr, uStr, lo, uo);
      lastEmittedRef.current = result;
      onChange(result);
    },
    [onChange]
  );

  const onLowerBracketToggle = useCallback(() => {
    const next = !lowerOpen;
    setLowerOpen(next);
    emitValue(lowerStr, upperStr, next, upperOpen);
  }, [lowerOpen, lowerStr, upperStr, upperOpen, emitValue]);

  const onUpperBracketToggle = useCallback(() => {
    const next = !upperOpen;
    setUpperOpen(next);
    emitValue(lowerStr, upperStr, lowerOpen, next);
  }, [upperOpen, lowerStr, upperStr, lowerOpen, emitValue]);

  const isNumber = definition.datatype === 'number';

  const numberConfig = isNumber ? (definition as NumberField).config : null;
  const numMin = numberConfig && 'minimum' in numberConfig ? (numberConfig.minimum ?? undefined) : undefined;
  const numMax = numberConfig && 'maximum' in numberConfig ? (numberConfig.maximum ?? undefined) : undefined;

  const onLowerNumberChange = useCallback(
    (v: number | null) => {
      const s = v != null ? String(v) : '';
      setLowerStr(s);
      emitValue(s, upperStr, lowerOpen, upperOpen);
    },
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperNumberChange = useCallback(
    (v: number | null) => {
      const s = v != null ? String(v) : '';
      setUpperStr(s);
      emitValue(lowerStr, s, lowerOpen, upperOpen);
    },
    [lowerStr, lowerOpen, upperOpen, emitValue]
  );

  const onLowerDateChange = useCallback(
    (v: Dayjs | null) => {
      const s = v?.format(DATE_FORMAT) ?? '';
      setLowerStr(s);
      emitValue(s, upperStr, lowerOpen, upperOpen);
    },
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperDateChange = useCallback(
    (v: Dayjs | null) => {
      const s = v?.format(DATE_FORMAT) ?? '';
      setUpperStr(s);
      emitValue(lowerStr, s, lowerOpen, upperOpen);
    },
    [lowerStr, lowerOpen, upperOpen, emitValue]
  );

  const lowerDateValue = lowerStr ? dayjs(lowerStr, DATE_FORMAT) : null;
  const upperDateValue = upperStr ? dayjs(upperStr, DATE_FORMAT) : null;

  return (
    <Space.Compact className="flex-1">
      <Button onClick={onLowerBracketToggle}>{lowerOpen ? '(' : '['}</Button>
      {isNumber ? (
        <InputNumber
          className="flex-1"
          style={{ width: '100%' }}
          controls={false}
          min={numMin}
          max={numMax}
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
        />
      )}
      <Button disabled>–</Button>
      {isNumber ? (
        <InputNumber
          className="flex-1"
          style={{ width: '100%' }}
          controls={false}
          min={numMin}
          max={numMax}
          value={upperStr ? parseFloat(upperStr) : null}
          onChange={onUpperNumberChange}
          placeholder="max"
        />
      ) : (
        <DatePicker
          className="flex-1"
          style={{ width: '100%' }}
          format={DATE_FORMAT}
          value={upperDateValue?.isValid() ? upperDateValue : null}
          onChange={onUpperDateChange}
          placeholder="end"
        />
      )}
      <Button onClick={onUpperBracketToggle}>{upperOpen ? ')' : ']'}</Button>
    </Space.Compact>
  );
};

export default RangeFilterInput;
