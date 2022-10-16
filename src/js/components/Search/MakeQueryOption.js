import React, { useState } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OptionDescription from './OptionDescription';
import { removeQueryParam } from '../../features/search/query';
import SelectOption from './SelectOption';

const MakeQueryOption = ({ queryField }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { title, id, description, config, options } = queryField;

  const [checked, setChecked] = useState(false);

  const [checkedCount, maxCount] = useSelector((state) => [
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
      <Row style={{ marginTop: '1rem' }}>
        <Col span={3} offset={2}>
          <Checkbox id={id} checked={checked} onChange={onCheckToggle} disabled={disabled} />
        </Col>
        <Col span={7}>{t(title)}</Col>
        <Col span={2}>
          <OptionDescription
            description={`${t(description)} ${config?.units ? '(' + t('in') + ' ' + t(config.units) + ')' : ''}`}
          />
        </Col>
        <Col span={10}>
          <SelectOption id={id} options={options} isChecked={checked} />
        </Col>
      </Row>
    </>
  );
};

export default MakeQueryOption;
