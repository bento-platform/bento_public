import { type CSSProperties, type ReactNode, memo, useCallback, useMemo } from 'react';
import { Button, Flex, Select, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import type { FilterValue } from '@/features/search/types';
import type { NumberField } from '@/types/discovery/fieldDefinition';

import { useTranslationFn } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';
import OptionDescription from '@/components/Search/OptionDescription';
import DateRangeFilterInput from '@/components/Search/DateRangeFilterInput';
import NumberRangeFilterInput from '@/components/Search/NumberRangeFilterInput';
import EnumFilterInput from '@/components/Search/EnumFilterInput';

export type FilterInputValue = { field: string | null; value: FilterValue };

const WRAPPER_STYLE: CSSProperties = {
  padding: 8,
  borderRadius: 8,
  border: '1px solid #F0F0F0',
};

const SearchFilterInputWrapper = ({ children }: { children: ReactNode }) => (
  <Space direction="vertical" size="small" className="w-full" style={WRAPPER_STYLE}>
    {children}
  </Space>
);

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

  const fieldDefinitionMap = useMemo(
    () => Object.fromEntries(filterSections.flatMap(({ fields }) => fields.map((f) => [f.id, f.definition]))),
    [filterSections]
  );

  const onFilterFieldChange = useCallback(
    (v: string) => {
      onChange({ field: v, value: null });
    },
    [onChange]
  );

  const onFilterValueChange = useCallback(
    (newValue: string | string[] | null) => onChange({ field, value: newValue }),
    [field, onChange]
  );

  const currentFieldDef = field ? fieldDefinitionMap[field] : undefined;
  const isRangeField = hasQueryData && (currentFieldDef?.datatype === 'number' || currentFieldDef?.datatype === 'date');

  const valueOptions = field ? fieldFilterOptions[field] : [];
  const isMultiple = hasQueryData && valueOptions.length > 2;
  const finalValue = useMemo(
    () => (isMultiple && value !== null && !Array.isArray(value) ? [value] : value),
    [isMultiple, value]
  );

  const inputClass = 'w-full';

  return (
    <SearchFilterInputWrapper>
      <Flex gap={4} vertical>
        <Flex gap="small" className="w-full">
          <Select
            className="flex-1 h-auto"
            options={filterOptions}
            size="small"
            // variant={vertical ? 'filled' : undefined}
            onChange={onFilterFieldChange}
            value={field}
            placeholder={t('search.filter_placeholder')}
          />
          <Button
            icon={<CloseOutlined />}
            size="small"
            shape="circle"
            color="danger"
            variant="filled"
            disabled={!field}
            onClick={onRemove}
          />
        </Flex>
        {field && (
          <div style={{ margin: '0 8px' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t(fieldDefinitionMap[field].description)}
            </Typography.Text>
          </div>
        )}
      </Flex>
      {isRangeField && currentFieldDef?.datatype === 'number' ? (
        <NumberRangeFilterInput
          className={inputClass}
          definition={currentFieldDef as NumberField}
          value={Array.isArray(value) ? (value[0] ?? null) : value}
          onChange={onFilterValueChange}
        />
      ) : isRangeField && currentFieldDef?.datatype === 'date' ? (
        <DateRangeFilterInput
          className={inputClass}
          value={Array.isArray(value) ? (value[0] ?? null) : value}
          onChange={onFilterValueChange}
        />
      ) : (
        <EnumFilterInput
          isMultiple={isMultiple}
          className={inputClass}
          disabled={!field}
          options={valueOptions}
          onChange={onFilterValueChange}
          value={finalValue}
        />
      )}
    </SearchFilterInputWrapper>
  );
};

export const SearchFilterInputSkeleton = memo(() => (
  <SearchFilterInputWrapper>
    <Flex gap="small" className="w-full">
      <Select className="flex-1" size="small" disabled={true} loading={true} />
      <Button icon={<CloseOutlined />} size="small" shape="circle" color="danger" variant="filled" disabled />
    </Flex>
    <Select className="flex-1 w-full" disabled={true} />
  </SearchFilterInputWrapper>
));
SearchFilterInputSkeleton.displayName = 'SearchFilterInputSkeleton';

export default SearchFilterInput;
