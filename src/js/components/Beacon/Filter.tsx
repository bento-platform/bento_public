import React, { useEffect, useState } from 'react';
import { Button, Form, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FormFilter } from '@/types/beacon';
import { Section, Field } from '@/types/search';
import { FormInstance} from 'antd/es/form'


// TODOs:
// any search key (eg "sex") selected in one filter should not available in other
// for clarity they should probably appear, but be greyed out
// this requires rendering select options as <Option> components

const FILTER_FORM_ITEM_STYLE = { flex: 1, marginInlineEnd: -1 };
const FILTER_FORM_ITEM_INNER_STYLE = { width: '100%' };

const Filter = ({ filter, form, querySections, removeFilter, isRequired }: FilterProps) => {
  const [valueOptions, setValueOptions] = useState([{ label: '', value: '' }]);

  const handleSelectKey = (_, option) => {
    // set dropdown options for a particular key
    // ie for key "sex", set options to "MALE", "FEMALE", etc
    setValueOptions(option.optionsThisKey);
  };

  // rerender default option when key changes
  useEffect(() => {
    form.setFieldsValue({
      [`filterValue${filter.index}`]: valueOptions[0].value,
    });
  }, [valueOptions]);

  const renderLabel = (searchField: Field) => {
    const units = searchField.config?.units;
    const unitsString = units ? ` (${units})` : '';
    return searchField.title + unitsString;
  };

  const searchKeyOptions = (arr: Section[]) =>
    arr.map((qs) => ({
      label: qs.section_title,
      options: qs.fields.map((field) => ({
        label: renderLabel(field),
        value: field.id,
        optionsThisKey: searchValueOptions(field.options),
      })),
    }));

  const searchValueOptions = (arr: Field["options"]) => arr.map((v) => ({ label: v, value: v }));

  return (
    <Space.Compact>
      <Form.Item
        name={`filterId${filter.index}`}
        rules={[{ required: isRequired, message: 'search field required' }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select
          placeholder={'select a search field'}
          style={FILTER_FORM_ITEM_INNER_STYLE}
          onSelect={handleSelectKey}
          options={searchKeyOptions(querySections)}
        />
      </Form.Item>
      <Form.Item
        name={`filterValue${filter.index}`}
        rules={[{ required: isRequired, message: 'value required' }]}
        style={FILTER_FORM_ITEM_STYLE}
      >
        <Select style={FILTER_FORM_ITEM_INNER_STYLE} options={valueOptions} />
      </Form.Item>
      <Button onClick={() => removeFilter(filter)}>
        <CloseOutlined />
      </Button>
    </Space.Compact>
  );
};

export interface FilterProps {
  filter: FormFilter;
  form: FormInstance<any>;
  querySections: Section[];
  removeFilter: (filter: FormFilter) => void;
  isRequired: boolean;
}

export default Filter;
