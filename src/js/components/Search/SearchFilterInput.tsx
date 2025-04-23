import { type CSSProperties, memo, useCallback, useMemo } from 'react';
import { Button, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import OptionDescription from '@/components/Search/OptionDescription';

export type FilterValue = { field: string | null; value: string | null };

const styles = {
  selectField: { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 } as CSSProperties,
  selectValue: { flex: 1 } as CSSProperties,
};

const SearchFilterInput = ({
  field,
  value,
  onChange,
  onFocus,
  onRemove,
  disabledFields,
}: FilterValue & {
  onChange: (v: FilterValue) => void;
  onFocus: () => void;
  onRemove: () => void;
  disabledFields: Set<string>;
}) => {
  const t = useTranslationFn();

  const { filterSections } = useSearchQuery();

  const filterOptions = filterSections.map(({ section_title: label, fields }) => ({
    label,
    title: label,
    options: fields.map((f) => ({
      value: f.id,
      label: (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>{f.title}</div>
          <OptionDescription description={t(f.description)} />
        </div>
      ),
      // Disabled if: field is in disabled set AND it isn't the currently selected field (so we allow re-selection of
      // the current field.)
      disabled: disabledFields.has(f.id) && field !== f.id,
    })),
  }));

  const fieldFilterOptions = useMemo(
    () =>
      Object.fromEntries(
        filterSections.flatMap(({ fields }) =>
          fields.map((f) => [f.id, f.options.map((o) => ({ value: o, label: o }))])
        )
      ),
    [filterSections]
  );

  const onFilterFieldChange = useCallback(
    (v: string) => {
      onChange({ field: v, value: fieldFilterOptions[v][0].value ?? null });
    },
    [onChange, fieldFilterOptions]
  );

  const onFilterValueChange = useCallback(
    (newValue: string) =>
      onChange({
        field,
        value: newValue,
      }),
    [field, onChange]
  );

  return (
    <Space.Compact className="w-full">
      <Select
        style={styles.selectField}
        options={filterOptions}
        onClick={onFocus}
        onFocus={onFocus}
        onChange={onFilterFieldChange}
        value={field}
        placeholder={t('Select a field to filter by\u2026')}
      />
      <Select
        style={styles.selectValue}
        disabled={!field}
        options={field ? fieldFilterOptions[field] : []}
        onClick={onFocus}
        onFocus={onFocus}
        onChange={onFilterValueChange}
        value={value}
      />
      <Button icon={<CloseOutlined />} disabled={!field || !value} onClick={onRemove} />
    </Space.Compact>
  );
};

export const SearchFilterInputSkeleton = memo(() => (
  <Space.Compact className="w-full">
    <Select style={styles.selectField} disabled={true} loading={true} />
    <Select style={styles.selectValue} disabled={true} />
    <Button icon={<CloseOutlined />} disabled={true} />
  </Space.Compact>
));
SearchFilterInputSkeleton.displayName = 'SearchFilterInputSkeleton';

export default SearchFilterInput;
