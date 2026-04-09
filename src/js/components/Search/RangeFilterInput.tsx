import { useCallback, useMemo } from 'react';
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

  // All display state is derived from the prop; no local state needed.
  const { lowerStr, upperStr, lowerOpen, upperOpen } = useMemo(() => parseBrackets(rawValue), [rawValue]);

  const emitValue = useCallback(
    (lStr: string, uStr: string, lo: boolean, uo: boolean) => onChange(buildRangeString(lStr, uStr, lo, uo)),
    [onChange]
  );

  const onLowerBracketToggle = useCallback(
    () => emitValue(lowerStr, upperStr, !lowerOpen, upperOpen),
    [lowerStr, upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperBracketToggle = useCallback(
    () => emitValue(lowerStr, upperStr, lowerOpen, !upperOpen),
    [lowerStr, upperStr, lowerOpen, upperOpen, emitValue]
  );

  const isNumber = definition.datatype === 'number';

  const numberConfig = isNumber ? (definition as NumberField).config : null;
  const numMin = numberConfig && 'minimum' in numberConfig ? (numberConfig.minimum ?? undefined) : undefined;
  const numMax = numberConfig && 'maximum' in numberConfig ? (numberConfig.maximum ?? undefined) : undefined;

  const onLowerNumberChange = useCallback(
    (v: number | null) => emitValue(v != null ? String(v) : '', upperStr, lowerOpen, upperOpen),
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperNumberChange = useCallback(
    (v: number | null) => emitValue(lowerStr, v != null ? String(v) : '', lowerOpen, upperOpen),
    [lowerStr, lowerOpen, upperOpen, emitValue]
  );

  const onLowerDateChange = useCallback(
    (v: Dayjs | null) => emitValue(v?.format(DATE_FORMAT) ?? '', upperStr, lowerOpen, upperOpen),
    [upperStr, lowerOpen, upperOpen, emitValue]
  );

  const onUpperDateChange = useCallback(
    (v: Dayjs | null) => emitValue(lowerStr, v?.format(DATE_FORMAT) ?? '', lowerOpen, upperOpen),
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
