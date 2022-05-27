import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';

const NumberInputOption = ({ name, isChecked }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  useEffect(() => {
    dispatch(addQueryParam({ name, queryType: 'number', params: { value } }));
  }, [isChecked, value]);

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <InputNumber
      id={name}
      name="number"
      value={value}
      disabled={!isChecked}
      style={{ maxWidth: '100%' }}
      onChange={(e) => handleValueChange(e)}
    />
  );
};

export default NumberInputOption;
