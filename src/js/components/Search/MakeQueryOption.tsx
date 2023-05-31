import React, { useEffect } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

import OptionDescription from './OptionDescription';
import { addQueryParam, makeGetKatsuPublic, removeQueryParam } from '@/features/search/query.store';
import SelectOption from './SelectOption';

import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Field } from '@/types/search';
import { useLocation, useNavigate } from 'react-router-dom';

const MakeQueryOption = ({ queryField }: MakeQueryOptionProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { title, id, description, config, options } = queryField;

  const [checkedCount, queryParams, maxCount] = useAppSelector((state) => [
    state.query.queryParamCount,
    state.query.queryParams,
    state.config.maxQueryParameters,
  ]);

  useEffect(() => {
    navigate(`${location.pathname}?${new URLSearchParams(queryParams).toString()}`, { replace: true });
  }, [queryParams]);

  const isChecked = Object.prototype.hasOwnProperty.call(queryParams, id);

  const onCheckToggle = () => {
    if (isChecked) {
      dispatch(removeQueryParam(id));
    } else {
      dispatch(addQueryParam({ id, value: options[0] }));
    }
    dispatch(makeGetKatsuPublic());
  };

  const disabled = isChecked ? false : checkedCount >= maxCount;

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
