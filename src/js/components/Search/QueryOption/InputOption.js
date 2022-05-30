import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';

const InputOption = ({ name, isChecked }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (isChecked) {
      dispatch(addQueryParam({ name, queryType: 'input', params: { value } }));
    }
  }, [isChecked, value]);

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return <Input onChange={handleValueChange} disabled={!isChecked} />;
};

export default InputOption;
