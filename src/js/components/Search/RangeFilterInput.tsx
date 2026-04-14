import type { DateField, NumberField } from '@/types/discovery/fieldDefinition';
import type { FilterValue } from '@/features/search/types';
import DateRangeFilterInput from './DateRangeFilterInput';
import NumberRangeFilterInput from './NumberRangeFilterInput';

type RangeFilterInputProps = {
  definition: NumberField | DateField;
  value: FilterValue;
  onChange: (v: FilterValue) => void;
};

const RangeFilterInput = ({ definition, value, onChange }: RangeFilterInputProps) => {
  if (definition.datatype === 'number') {
    return <NumberRangeFilterInput value={value} onChange={onChange} />;
  }
  return <DateRangeFilterInput value={value} onChange={onChange} />;
};

export default RangeFilterInput;
