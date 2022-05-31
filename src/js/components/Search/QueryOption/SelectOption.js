import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import { queryTypes } from '../../../constants/queryConstants';

const SelectOption = ({ name, isChecked, data }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (isChecked) {
      dispatch(
        addQueryParam({ name, queryType: queryTypes.SELECT, params: { value } })
      );
    }
  }, [isChecked, value, data]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Select
      id={name}
      disabled={!isChecked}
      showSearch
      style={{ width: '100%' }}
      onChange={handleValueChange}
    >
      <Select.Option key={name} value=""></Select.Option>
      {data.enum.map((item) => (
        <Select.Option key={item} value={item.name}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectOption;
