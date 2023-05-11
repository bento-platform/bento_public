import { useEffect, useState } from 'react';
import { Input, Form, Select, Space } from 'antd';

// helptext
// should be able to remove a particular filter

const Filter = ({ filter, form, querySections }) => {
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

  const searchKeyOptions = (obj) => {
    return obj.map((qs) => ({
      label: qs.section_title,
      options: qs.fields.map((field) => ({
        label: field.title,
        value: field.id,
        optionsThisKey: searchValueOtions(field.options),
      })),
    }));
  };

  const searchValueOtions = (arr) => {
    return arr.map((v) => ({ label: v, value: v }));
  };

  return (
    <Space.Compact>
      <Form.Item name={`filterId${filter.index}`} rules={[{ required: true, message: 'search field required' }]}>
        <Select
          placeholder={'select a search field'}
          style={{ width: 250 }}
          onSelect={handleSelectKey}
          options={searchKeyOptions(querySections)}
        />
      </Form.Item>
      <Form.Item
        name={`filterValue${filter.index}`}
        rules={[{ required: true, message: 'value required' }]}
        style={{ width: '150px' }}
      >
        <Select style={{ width: 250 }} options={valueOptions} />
      </Form.Item>
    </Space.Compact>
  );
};

export default Filter;
