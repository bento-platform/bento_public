import React, { useEffect, useState } from 'react';
import { Button, Form, Select, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// TODOs:
// any search key (eg "sex") selected in one filter should not available in other
// for clarity they should probably appear, but be greyed out
// this requires rendering select options as <Option> components

const Filter = ({ filter, form, querySections, removeFilter, isRequired }) => {
  const [valueOptions, setValueOptions] = useState([{ value: '' }]);

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

  const renderLabel = (searchField) => {
    const units = searchField.config?.units;
    const unitsString = units ? ` (${units})` : '';
    return searchField.title + unitsString;
  };

  const searchKeyOptions = (arr) =>
    arr.map((qs) => ({
      label: qs.section_title,
      options: qs.fields.map((field) => ({
        label: renderLabel(field),
        value: field.id,
        optionsThisKey: searchValueOptions(field.options),
      })),
    }));

  const searchValueOptions = (arr) => arr.map((v) => ({ label: v, value: v }));

  return (
    <Space.Compact>
      <Form.Item name={`filterId${filter.index}`} rules={[{ required: isRequired, message: 'search field required' }]}>
        <Select
          placeholder={'select a search field'}
          style={{ width: 220 }}
          onSelect={handleSelectKey}
          options={searchKeyOptions(querySections)}
        />
      </Form.Item>
      <Form.Item name={`filterValue${filter.index}`} rules={[{ required: isRequired, message: 'value required' }]}>
        <Select style={{ width: 220 }} options={valueOptions} />
      </Form.Item>
      <Button onClick={() => removeFilter(filter)}>
        <CloseOutlined />
      </Button>
    </Space.Compact>
  );
};

export default Filter;
