import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { addQueryParam } from '../../features/search/query';

const SelectOption = ({ id, isChecked, options, optionalDispatch}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [value, setValue] = useState(options[0]);

  useEffect(() => {
    if (isChecked) {
      dispatch(addQueryParam({ id, value }));
    }
  }, [isChecked, value, options]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (optionalDispatch != undefined) {
      dispatch(optionalDispatch());
    }
  };

  return (
    <Select
      id={id}
      disabled={!isChecked}
      showSearch
      style={{ width: '100%' }}
      onChange={handleValueChange}
      defaultValue={options[0]}
    >
      {options.map((item) => (
        <Select.Option key={item} value={item}>
          {t(item)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectOption;
