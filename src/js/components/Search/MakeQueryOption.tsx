import React, { useCallback } from 'react';
import { Row, Col, Checkbox } from 'antd';

import OptionDescription from './OptionDescription';
import SelectOption from './SelectOption';

import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { Field } from '@/types/search';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/utils/search';

const MakeQueryOption = ({ queryField }: MakeQueryOptionProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { title, id, description, config, options } = queryField;

  const maxQueryParameters = useAppSelector((state) => state.config.maxQueryParameters);
  const { queryParamCount, queryParams } = useAppSelector((state) => state.query);

  const isChecked = id in queryParams;

  const onCheckToggle = useCallback(() => {
    let url: string;
    if (isChecked) {
      // If currently checked, uncheck it
      url = buildQueryParamsUrl(pathname, queryParamsWithoutKey(queryParams, id));
    } else {
      // If currently unchecked, check it
      url = buildQueryParamsUrl(pathname, { ...queryParams, [id]: options[0] });
    }

    console.debug('[MakeQueryOption] Redirecting to:', url);
    navigate(url, { replace: true });
    // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
  }, [id, isChecked, navigate, options, pathname, queryParams]);

  // TODO: allow disabling max query parameters for authenticated and authorized users when Katsu has AuthZ
  // useQueryWithAuthIfAllowed()
  // const maxQueryParametersRequired = useAppSelector((state) => state.config.maxQueryParametersRequired);
  // const hasMaxFilters = maxQueryParametersRequired && queryParamCount >= maxQueryParameters;
  // const disabled = isChecked ? false : hasMaxFilters;
  const disabled = isChecked ? false : queryParamCount >= maxQueryParameters;

  return (
    <>
      <Row style={{ width: '900px' }}>
        <Col span={3} offset={2}>
          <Checkbox id={id} checked={isChecked} onChange={onCheckToggle} disabled={disabled} />
        </Col>
        <Col span={7}>{`${t(title)} ${config?.units ? '(' + td('in') + ' ' + t(config.units) + ')' : ''}`}</Col>
        <Col span={2}>
          <OptionDescription description={t(description)} />
        </Col>
        <Col span={10}>
          <SelectOption id={id} options={options} isChecked={isChecked} />
        </Col>
      </Row>
    </>
  );
};

interface MakeQueryOptionProps {
  queryField: Field;
}

export default MakeQueryOption;
