import React, { useState } from 'react';
import OptionDescription from './OptionDescription';
import { Row, Col, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { removeQueryParam } from '../../features/search/query';
import SelectOption from './SelectOption';

const MakeQueryOption = ({ queryField }) => {
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
        <Col span={7}>{title}</Col>
        <Col span={2}>
          <OptionDescription description={`${description} ${config?.units ? '(in ' + config.units + ')' : ''}`} />
        </Col>
        <Col span={10}>
          <SelectOption id={id} options={options} isChecked={checked} />
        </Col>
      </Row>
    </>
  );
};

export default MakeQueryOption;
