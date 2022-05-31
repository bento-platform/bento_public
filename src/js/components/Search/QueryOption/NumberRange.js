import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import { queryTypes } from '../../../constants/queryConstants';

const NumberRange = ({ name, data, isChecked }) => {
  const [rangeMin, setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(data.bin_size);

  const dispatch = useDispatch();

  useEffect(() => {
    //update query params
    if (isChecked) {
      dispatch(
        addQueryParam({
          name,
          queryType: queryTypes.RANGE,
          params: { rangeMin, rangeMax },
        })
      );
    }
  }, [isChecked, rangeMin, rangeMax]);

  const handleRangeMinChange = (newValue) => {
    // Floor to the nearest bin_size
    if (data.bin_size) {
      newValue = newValue - (newValue % data.bin_size);
    }
    setRangeMin(newValue);
  };

  const handleRangeMaxChange = (newValue) => {
    // Floor to the nearest bin_size
    if (data.bin_size) {
      newValue = newValue - (newValue % data.bin_size);
    }
    setRangeMax(newValue);
  };

  return (
    <Row>
      <Col xs={{ span: 4 }}>
        <InputNumber
          id={name}
          name="range-min"
          value={rangeMin}
          step={data.bin_size}
          min={data.minimum || -Infinity}
          max={rangeMax - data.bin_size}
          disabled={!isChecked}
          style={{ maxWidth: '100%' }}
          onChange={(e) => handleRangeMinChange(e)}
        />
      </Col>
      <Col xs={{ span: 4 }} style={{ textAlign: 'center' }}>
        to
      </Col>
      <Col xs={{ span: 4 }}>
        <InputNumber
          id={name}
          name="range-max"
          value={rangeMax}
          step={data.bin_size}
          min={rangeMin + data.bin_size}
          max={data.maximum || Infinity}
          disabled={!isChecked}
          style={{ maxWidth: '100%' }}
          onChange={(e) => handleRangeMaxChange(e)}
        />
      </Col>
    </Row>
  );
};

export default NumberRange;
