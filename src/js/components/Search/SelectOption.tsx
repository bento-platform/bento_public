/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { addQueryParam } from '@/features/search/query.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch } from '@/hooks';

const SelectOption = ({ id, isChecked, options }: SelectOptionProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState(options[0]);

  useEffect(() => {
    if (isChecked) {
      dispatch(addQueryParam({ id, value }));
    }
  }, [isChecked, value, options]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
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

export interface SelectOptionProps {
  id: string;
  isChecked: boolean;
  options: string[];
  optionalDispatch?: any;
}

export default SelectOption;
