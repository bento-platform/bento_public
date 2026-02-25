import { memo, useCallback, useMemo } from 'react';
import { Button, Flex, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import type { FilterValue } from '@/features/search/types';

import { useTranslationFn } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';
import OptionDescription from '@/components/Search/OptionDescription';

export type FilterInputValue = { field: string | null; value: FilterValue };

const SearchFilterInput = ({
  field,
  value,
  onChange,
  onRemove,
  disabledFields,
}: FilterInputValue & {
  onChange: (v: FilterInputValue) => void;
  onRemove: () => void;
  disabledFields: Set<string>;
}) => {
  const t = useTranslationFn();
  const { hasPermission: hasQueryData } = useScopeQueryData();

  const { filterSections } = useSearchQuery();

  const filterOptions = useMemo(
    () =>
      filterSections.map(({ section_title: label, fields }) => ({
        label: t(label),
        title: t(label),
        options: fields.map((f) => ({
          value: f.id,
          label: (
            <Flex>
              <div className="flex-1">{`${t(f.definition.title)}${f.definition.datatype === 'number' && f.definition.config?.units ? ` (${t(f.definition.config.units)})` : ''}`}</div>
              <OptionDescription description={t(f.definition.description)} />
            </Flex>
          ),
          // Disabled if: field is in disabled set AND it isn't the currently selected field (so we allow re-selection of
          // the current field.)
          disabled: disabledFields.has(f.id) && field !== f.id,
        })),
      })),
    [t, filterSections, field, disabledFields]
  );

  const fieldFilterOptions = useMemo(
    () =>
      Object.fromEntries(
        filterSections.flatMap(({ fields }) =>
          fields.map((f) => [f.id, f.options.map((o) => ({ value: o, label: t(o) }))])
        )
      ),
    [t, filterSections]
  );

  const onFilterFieldChange = useCallback(
    (v: string) => {
      onChange({ field: v, value: fieldFilterOptions[v][0].value ?? null });
    },
    [onChange, fieldFilterOptions]
  );

  const onFilterValueChange = useCallback(
    (newValue: string | string[]) =>
      onChange({
        field,
        value: newValue,
      }),
    [field, onChange]
  );

  const valueOptions = field ? fieldFilterOptions[field] : [];
  const isMultiple = hasQueryData && valueOptions.length > 2;
  const finalValue = useMemo(
    () => (isMultiple && value !== null && !Array.isArray(value) ? [value] : value),
    [isMultiple, value]
  );

  return (
    <Space.Compact className="w-full">
      <Select
        className="flex-1 rounded-e-none"
        options={filterOptions}
        onChange={onFilterFieldChange}
        value={field}
        placeholder={t('search.filter_placeholder')}
      />
      <Select
        mode={isMultiple ? 'multiple' : undefined}
        className="flex-1"
        disabled={!field}
        options={valueOptions}
        onChange={onFilterValueChange}
        value={finalValue}
      />
      <Button icon={<CloseOutlined />} disabled={!field || !value} onClick={onRemove} />
    </Space.Compact>
  );
};

export const SearchFilterInputSkeleton = memo(() => (
  <Space.Compact className="w-full">
    <Select className="flex-1 rounded-e-none" disabled={true} loading={true} />
    <Select className="flex-1" disabled={true} />
    <Button icon={<CloseOutlined />} disabled={true} />
  </Space.Compact>
));
SearchFilterInputSkeleton.displayName = 'SearchFilterInputSkeleton';

export default SearchFilterInput;
