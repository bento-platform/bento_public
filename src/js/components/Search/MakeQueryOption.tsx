import React from 'react';
import { Row, Col, Checkbox } from 'antd';

import OptionDescription from './OptionDescription';
import { addQueryParam, makeGetKatsuPublic, removeQueryParam } from '@/features/search/query.store';
import SelectOption from './SelectOption';

import { useAppDispatch, useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Field } from '@/types/search';

const MakeQueryOption = ({ queryField }: MakeQueryOptionProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();
  const dispatch = useAppDispatch();

  const { title, id, description, config, options } = queryField;

  const maxQueryParameters = useAppSelector((state) => state.config.maxQueryParameters);
  const { queryParamCount, queryParams } = useAppSelector((state) => state.query);

  const isChecked = Object.prototype.hasOwnProperty.call(queryParams, id);

  const onCheckToggle = () => {
    if (isChecked) {
      dispatch(removeQueryParam(id));
    } else {
      dispatch(addQueryParam({ id, value: options[0] }));
    }
    dispatch(makeGetKatsuPublic());
  };

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
