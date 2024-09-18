import type { type CSSProperties } from 'react';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from 'antd';

import { useAppSelector, useTranslationCustom } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';

const SELECT_STYLE: CSSProperties = { width: '100%' };

const SelectOption = ({ id, isChecked, options }: SelectOptionProps) => {
  const t = useTranslationCustom();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { queryParams } = useAppSelector((state) => state.query);
  const defaultValue = queryParams[id] || options[0];

  const handleValueChange = useCallback(
    (newValue: string) => {
      const url = buildQueryParamsUrl(pathname, { ...queryParams, [id]: newValue });
      console.debug('[SelectOption] Redirecting to:', url);
      navigate(url, { replace: true });
      // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
    },
    [id, navigate, pathname, queryParams]
  );

  const selectOptions = useMemo(() => options.map((item) => ({ value: item, label: t(item) })), [options, t]);

  return (
    <Select
      id={id}
      disabled={!isChecked}
      showSearch
      style={SELECT_STYLE}
      onChange={handleValueChange}
      value={defaultValue}
      defaultValue={defaultValue}
      options={selectOptions}
    />
  );
};

export interface SelectOptionProps {
  id: string;
  isChecked: boolean;
  options: string[];
}

export default SelectOption;
