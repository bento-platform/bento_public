import React, { useEffect } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

import OptionDescription from './OptionDescription';
import { addQueryParam, makeGetKatsuPublic, removeQueryParam } from '@/features/search/query.store';
import SelectOption from './SelectOption';

import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Field } from '@/types/search';
import { useNavigate } from 'react-router-dom';

const MakeQueryOption = ({ queryField }: MakeQueryOptionProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { title, id, description, config, options } = queryField;

  const [checkedCount, maxCount, queryParams] = useAppSelector((state) => [
    state.query.queryParamCount,
    state.config.maxQueryParameters,
    state.query.queryParams,
  ]);

  useEffect(() => {
    navigate(`/en/search?${new URLSearchParams(queryParams).toString()}`);
  }, [queryParams]);

  const isChecked = queryParams.hasOwnProperty(id);

  // console.log('id', id, 'queryParams', queryParams, 'queryParams.hasOwnProperty(id)', queryParams.hasOwnProperty(id));

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
        <Col span={7}>{t(title)}</Col>
        <Col span={2}>
          <OptionDescription
            description={`${t(description)} ${config?.units ? '(' + td('in') + ' ' + t(config.units) + ')' : ''}`}
          />
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
