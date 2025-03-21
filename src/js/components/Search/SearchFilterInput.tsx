import { useTranslationFn } from '@/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import OptionDescription from '@/components/Search/OptionDescription';
import { Button, Select, Space } from 'antd';
import { WIDTH_100P_STYLE } from '@/constants/common';
import { CloseOutlined } from '@ant-design/icons';

export type FilterValue = { field: string | null; value: string | null };

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

  const { querySections } = useSearchQuery();

  const filterOptions = querySections.map(({ section_title: label, fields }) => ({
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

  const fieldFilterOptions = Object.fromEntries(
    querySections.flatMap(({ fields }) => fields.map((f) => [f.id, f.options.map((o) => ({ value: o, label: o }))]))
  );

  return (
    <Space.Compact style={WIDTH_100P_STYLE}>
      <Select
        style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        options={filterOptions}
        onClick={() => onFocus()}
        onFocus={() => onFocus()}
        onChange={(v) => {
          onChange({ field: v, value: fieldFilterOptions[v][0].value ?? null });
        }}
        value={field}
        placeholder={t('Select a field to filter by\u2026')}
      />
      <Select
        style={{ flex: 1 }}
        disabled={!field}
        options={field ? fieldFilterOptions[field] : []}
        onClick={() => onFocus()}
        onFocus={() => onFocus()}
        onChange={(newValue) => {
          onChange({ field, value: newValue });
        }}
        value={value}
      />
      <Button icon={<CloseOutlined />} disabled={!field || !value} onClick={onRemove} />
    </Space.Compact>
  );
};

export const SearchFilterInputSkeleton = () => (
  <Space.Compact style={WIDTH_100P_STYLE}>
    <Select style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} disabled={true} loading={true} />
    <Select style={{ flex: 1 }} disabled={true} />
    <Button icon={<CloseOutlined />} disabled={true} />
  </Space.Compact>
);

export default SearchFilterInput;
