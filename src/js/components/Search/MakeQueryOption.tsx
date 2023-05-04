import React, { useState } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OptionDescription from './OptionDescription';
import { removeQueryParam } from '@/features/search/query.store';
import SelectOption from './SelectOption';

import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { Field } from '@/types/search';

const MakeQueryOption = ({ queryField }: MakeQueryOptionProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const dispatch = useDispatch();

  const { title, id, description, config, options } = queryField;

  const [checked, setChecked] = useState(false);

  const [checkedCount, maxCount] = useAppSelector((state) => [
    state.query.queryParamCount,
    state.config.maxQueryParameters,
  ]);

  const onCheckToggle = () => {
    if (checked) {
      setChecked(false);
      dispatch(removeQueryParam(id));
    } else checkedCount < maxCount && setChecked(true);
  };

  const disabled = checked ? false : checkedCount >= maxCount;

  return (
    <>
      <Row style={{ width: '900px' }}>
        <Col span={3} offset={2}>
          <Checkbox id={id} checked={checked} onChange={onCheckToggle} disabled={disabled} />
        </Col>
        <Col span={7}>{t(title)}</Col>
        <Col span={2}>
          <OptionDescription
            description={`${t(description)} ${config?.units ? '(' + td('in') + ' ' + t(config.units) + ')' : ''}`}
          />
        </Col>
        <Col span={10}>
          <SelectOption id={id} options={options} isChecked={checked} />
        </Col>
      </Row>
    </>
  );
};

interface MakeQueryOptionProps {
  queryField: Field;
}

export default MakeQueryOption;
