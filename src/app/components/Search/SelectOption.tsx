/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Select } from 'antd';

import { addQueryParam, makeGetKatsuPublic } from '@/features/search/query.store';
import { useAppDispatch, useAppSelector, useTranslationCustom } from '@/hooks';

const SelectOption = ({ id, isChecked, options }: SelectOptionProps) => {
  const t = useTranslationCustom();
  const dispatch = useAppDispatch();

  const queryParams = useAppSelector((state) => state.query.queryParams);
  const defaultValue = queryParams[id] || options[0];

  const handleValueChange = (newValue: string) => {
    dispatch(addQueryParam({ id, value: newValue }));
    dispatch(makeGetKatsuPublic());
  };

  return (
    <Select
      id={id}
      disabled={!isChecked}
      showSearch
      style={{ width: '100%' }}
      onChange={handleValueChange}
      value={defaultValue}
      defaultValue={defaultValue}
      options={options.map((item) => ({ value: item, label: t(item) }))}
    />
  );
};

export interface SelectOptionProps {
  id: string;
  isChecked: boolean;
  options: string[];
}

export default SelectOption;
