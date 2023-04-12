import React, { useRef, useEffect, useState } from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { addQueryParam } from '@/features/search/query.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';

const SelectOption = ({ id, isChecked, options, optionalDispatch }: SelectOptionProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const dispatch = useDispatch();

  const [value, setValue] = useState(options[0]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isChecked) {
      dispatch(addQueryParam({ id, value }));
    }

    // to prevent everything between the lines '--'
    // at component initialization
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    // --
    if (optionalDispatch) {
      dispatch(optionalDispatch());
    }
    // --
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
  optionalDispatch?: () => void;
}

export default SelectOption;
