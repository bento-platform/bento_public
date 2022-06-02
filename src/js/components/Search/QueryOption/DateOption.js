import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import moment from 'moment';
import { queryTypes } from '../../../constants/queryConstants';

const DateOption = ({ name, data, isChecked }) => {
  const [dateBefore, setdateBefore] = useState('');
  const [dateAfter, setDateAfter] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    //update query params
    if (isChecked) {
      dispatch(
        addQueryParam({
          name,
          queryType: queryTypes.DATE,
          params: { dateAfter, dateBefore },
        })
      );
    }
  }, [isChecked, dateAfter, dateBefore]);

  const disabledDateAfter = (current) => {
    // TODO: disable dates earlier than first date in dataset
    if (dateBefore != '') {
      return (
        current &&
        (current > moment(dateBefore, 'YYYY-MM-DD') || current > moment())
      );
    } else {
      return current && current > moment(); // disable dates later than today
    }
  };

  const disabledDateBefore = (current) => {
    // TODO: disable dates earlier than first date in dataset
    if (dateAfter != '') {
      return (
        current &&
        (current < moment(dateAfter, 'YYYY-MM-DD') || current > moment())
      );
    } else {
      return current && current > moment(); // disable dates later than today
    }
  };

  const handleDateAfterChange = (newDate) => {
    let ndFmt = '';
    if (newDate !== null) {
      ndFmt = newDate.format('YYYY-MM-DD');
      const newD = new Date(ndFmt);
      // check date range mismatch
      const currentDateBeforeDate = new Date(dateBefore);

      if (newD > currentDateBeforeDate) {
        console.log("error: new date is after current 'before' date");
        setError(true);
        return;
      }
    }
    setDateAfter(ndFmt);
  };

  const handleDateBeforeChange = (newDate) => {
    let ndFmt = '';
    if (newDate !== null) {
      ndFmt = newDate.format('YYYY-MM-DD');
      const newD = new Date(ndFmt);
      // check date range mismatch
      const currentDateAfterDate = new Date(dateAfter);

      if (newD < currentDateAfterDate) {
        console.log("error: new date is before current 'after' date");
        setError(true);
        return;
      }
    }

    setdateBefore(ndFmt);
  };

  return (
    <Row>
      <Col xs={{ span: 5 }}>
        <DatePicker
          id={name}
          key={name}
          name="date-after"
          disabled={!isChecked}
          disabledDate={disabledDateAfter}
          status={error ? 'error' : ''}
          onChange={handleDateAfterChange}
        />
      </Col>
      <Col xs={{ span: 2 }} style={{ textAlign: 'center' }}>
        to
      </Col>
      <Col xs={{ span: 5 }}>
        <DatePicker
          id={name}
          key={name}
          name="date-before"
          disabled={!isChecked}
          disabledDate={disabledDateBefore}
          status={error ? 'error' : ''}
          onChange={handleDateBeforeChange}
        />
      </Col>
    </Row>
  );
};

export default DateOption;
