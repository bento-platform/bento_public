import { useEffect, useState } from 'react';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Button, Form, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import type {
  FormFilter,
  FilterOption,
  FilterPullDownKey,
  FilterPullDownValue,
  GenericOptionType,
} from '@/types/beacon';
import type { Section, Field } from '@/types/search';

// TODOs:
// any search key (eg "sex") selected in one filter should not available in other
// for clarity they should probably appear, but be greyed out
// this requires rendering select options as <Option> components

const FILTER_FORM_ITEM_STYLE = { flex: 1, marginInlineEnd: -1 };
const FILTER_FORM_ITEM_INNER_STYLE = { width: '100%' };

const Filter = ({ filter, form, querySections, removeFilter, isRequired }: FilterProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const [valueOptions, setValueOptions] = useState([{ label: '', value: '' }]);

  const handleSelectKey = (_: unknown, option: GenericOptionType) => {
    // set dropdown options for a particular key
    // ie for key "sex", set options to "MALE", "FEMALE", etc

    // narrow type of option
    // ant design has conflicting type inference when options are nested in more than one layer
    const currentOption = option as FilterPullDownKey;

    setValueOptions(currentOption.optionsThisKey);
  };

  // rerender default option when key changes
  useEffect(() => {
    form.setFieldsValue({
      [`filterValue${filter.index}`]: valueOptions[0].value,
    });
  }, [filter.index, form, valueOptions]);

  const renderLabel = (searchField: Field) => {
    const units = searchField.config?.units;
    const unitsString = units ? ` (${t(units)})` : '';
    return t(searchField.title) + unitsString;
  };

  const searchKeyOptions = (arr: Section[]): FilterOption[] => {
    return arr.map((qs) => ({
      label: t(qs.section_title),
      options: qs.fields.map((field) => ({
        label: renderLabel(field),
        value: field.id,
        optionsThisKey: searchValueOptions(field.options),
      })),
    }));
  };

  const searchValueOptions = (arr: Field['options']): FilterPullDownValue[] => arr.map((v) => ({ label: v, value: v }));

  return (
    <Space.Compact>
      <Form.Item
        name={`filterId${filter.index}`}
        rules={[{ required: isRequired, message: td('search field required') }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select
          placeholder={td('select a search field')}
          style={FILTER_FORM_ITEM_INNER_STYLE}
          onSelect={handleSelectKey}
          options={searchKeyOptions(querySections)}
        />
      </Form.Item>
      <Form.Item
        name={`filterValue${filter.index}`}
        rules={[{ required: isRequired, message: td('value required') }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select
          style={FILTER_FORM_ITEM_INNER_STYLE}
          options={valueOptions.map(({ label, value }) => ({ label: t(label), value }))}
        />
      </Form.Item>
      <Button onClick={() => removeFilter(filter)}>
        <CloseOutlined />
      </Button>
    </Space.Compact>
  );
};

export interface FilterProps {
  filter: FormFilter;
  form: FormInstance;
  querySections: Section[];
  removeFilter: (filter: FormFilter) => void;
  isRequired: boolean;
}

export default Filter;
