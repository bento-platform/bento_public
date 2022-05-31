import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import { queryTypes } from '../../../constants/queryConstants';

const InputOption = ({ name, isChecked }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (isChecked) {
      dispatch(
        addQueryParam({ name, queryType: queryTypes.INPUT, params: { value } })
      );
    }
  }, [isChecked, value]);

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return <Input onChange={handleValueChange} disabled={!isChecked} />;
};

export default InputOption;
