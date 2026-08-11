import { type CSSProperties, type ReactNode, memo, useCallback, useMemo } from 'react';
import { Button, Flex, Select, type SelectProps, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import type { FilterValue } from '@/features/search/types';
import type { Field, NumberField } from '@/types/discovery/fieldDefinition';

import { useLanguage, useTranslationFn } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';
import OptionDescription from '@/components/Search/OptionDescription';
import DateRangeFilterInput from '@/components/Search/DateRangeFilterInput';
import NumberRangeFilterInput from '@/components/Search/NumberRangeFilterInput';
import EnumFilterInput from '@/components/Search/EnumFilterInput';
import { formatDateBinKey } from '@/utils/rangeFilterUtils';

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
  const language = useLanguage();
  const { hasPermission: hasQueryData } = useScopeQueryData();

  const { filterSections } = useSearchQuery();

  const filterOptions = useMemo(
    () =>
      filterSections.map(({ section_title: label, fields }) => ({
        label: t(label),
        title: t(label),
        options: fields.map((f) => ({
          value: f.id,
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
          fields.map((f) => [
            f.id,
            f.options.map((o) => ({
              value: o,
              // Unauthenticated users pick date filters from a fixed list of bins rather than a range picker
              // (see isRangeField below), so bin keys ("2021-01") need to be formatted here.
              label: f.definition.datatype === 'date' && o !== 'missing' ? formatDateBinKey(o, language) : t(o),
            })),
          ])
        )
      ),
    [t, filterSections, language]
  );

  const fieldDefinitionMap = useMemo(
    () => Object.fromEntries(filterSections.flatMap(({ fields }) => fields.map((f) => [f.id, f.definition]))),
    [filterSections]
  );

  /**
   * Renders just the string label for an option
   * @param f - Field definition
   */
  const renderFilterOptionLabelString = useCallback(
    (f: Field) => `${t(f.title)}${f.datatype === 'number' && f.config?.units ? ` (${t(f.config.units)})` : ''}`,
    [t]
  );

  /** Renders the label (without a tooltip) for chosen Select options */
  const renderFilterLabel = useCallback<Exclude<SelectProps['labelRender'], undefined>>(
    ({ value: fId }) => renderFilterOptionLabelString(fieldDefinitionMap[fId as string]),
    [renderFilterOptionLabelString, fieldDefinitionMap]
  );

  /** Renders the string label + an option description tooltip for a non-chosen Select option */
  const renderFilterOption = useCallback<Exclude<SelectProps['optionRender'], undefined>>(
    ({ value: fId }) => {
      const f = fieldDefinitionMap[fId as string];
      return (
        <Flex>
          <div className="flex-1">{renderFilterOptionLabelString(f)}</div>
          <OptionDescription description={t(f.description)} />
        </Flex>
      );
    },
    [t, renderFilterOptionLabelString, fieldDefinitionMap]
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

  return (
    <SearchFilterInputWrapper>
      <Flex gap={4} vertical>
        <Flex gap="small" className="w-full">
          <Select
            className="flex-1 h-auto"
            options={filterOptions}
            size="small"
            optionRender={renderFilterOption}
            labelRender={renderFilterLabel}
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
          definition={currentFieldDef as NumberField}
          value={Array.isArray(value) ? (value[0] ?? null) : value}
          onChange={onFilterValueChange}
        />
      ) : isRangeField && currentFieldDef?.datatype === 'date' ? (
        <DateRangeFilterInput
          value={Array.isArray(value) ? (value[0] ?? null) : value}
          onChange={onFilterValueChange}
        />
      ) : (
        <EnumFilterInput
          isMultiple={isMultiple}
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
