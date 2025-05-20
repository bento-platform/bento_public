import { Flex } from 'antd';
import { useTranslationFn } from '@/hooks';
import OptionDescription from '@/components/Search/OptionDescription';
import type { BeaconFilterUiOptions } from '@/types/beacon';

const FilterLabel = ({ filter }: FilterLabelProps) => {
  const t = useTranslationFn();

  const units = filter.units ?? '';
  const unitsString = units ? ` (${t(units)})` : '';
  const helpText = t(filter.description);
  const labelText = t(filter.label) + unitsString;
  return (
    <Flex justify="space-between">
      {labelText}
      <OptionDescription description={helpText} />
    </Flex>
  );
};

export interface FilterLabelProps {
  filter: BeaconFilterUiOptions;
}

export default FilterLabel;
