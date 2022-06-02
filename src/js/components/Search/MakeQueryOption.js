import React, { useState } from 'react';
import OptionDescription from './OptionDescription';
import { Row, Col } from 'react-bootstrap';
import { Checkbox } from 'antd';
import QueryOption from './QueryOption/QueryOption';
import { useDispatch, useSelector } from 'react-redux';
import { removeQueryParam } from '../../features/query';

const MakeQueryOption = ({ queryField }) => {
  const dispatch = useDispatch();

  const { data, name, queryType } = queryField;

  const [checked, setChecked] = useState(false);

  const [checkedCount, maxCount] = useSelector((state) => [
    state.query.queryParamCount,
    state.config.maxQueryParameters,
  ]);

  const onCheckToggle = () => {
    if (checked) {
      setChecked(false);
      dispatch(removeQueryParam(name));
    } else checkedCount < maxCount && setChecked(true);
  };

  const disabled = checked ? false : checkedCount >= maxCount;

  return (
    <>
      <Row style={{ margin: '1rem' }}>
        <Col xs={{ span: 2, offset: 2 }}>
          <Checkbox
            id={name}
            checked={checked}
            onChange={onCheckToggle}
            disabled={disabled}
          />
        </Col>
        <Col xs={{ span: 3 }} md={{ span: 2 }}>
          {data.title}
        </Col>
        <Col xs={{ span: 1 }}>
          <OptionDescription
            description={`${data.description} ${
              data.units ? '(in ' + data.units + ')' : ''
            }`}
          />
        </Col>
        <Col xs={{ span: 4 }}>
          <QueryOption
            name={name}
            queryType={queryType}
            data={data}
            isChecked={checked}
          />
        </Col>
      </Row>
    </>
  );
};

export default MakeQueryOption;
