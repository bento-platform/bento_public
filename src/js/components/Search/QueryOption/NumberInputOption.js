import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import { queryTypes } from '../../../constants/queryConstants';

const NumberInputOption = ({ name, isChecked }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isChecked) {
      dispatch(
        addQueryParam({
          name,
          queryType: queryTypes.NUMBER_INPUT,
          params: { value },
        })
      );
    }
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
