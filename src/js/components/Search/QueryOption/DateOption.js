import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { addQueryParam } from '../../../features/query';
import moment from 'moment';
import {
  queryTypes,
  QUERY_START_LIMIT,
} from '../../../constants/queryConstants';
const { RangePicker } = DatePicker;

const DateOption = ({ name, isChecked }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    //update query params
    if (isChecked) {
      dispatch(
        addQueryParam({
          name,
          queryType: queryTypes.DATE,
          params: { dateAfter: '', dateBefore: '' },
        })
      );
    }
  }, [isChecked]);

  const onChange = (_value, dateString) => {
    dispatch(
      addQueryParam({
        name,
        queryType: queryTypes.DATE,
        params: { dateAfter: dateString[0], dateBefore: dateString[1] },
      })
    );
  };

  const disabledDate = (current) => {
    return (
      current &&
      (current > moment().endOf('day') ||
        current < moment(QUERY_START_LIMIT).endOf('day'))
    );
  };

  return (
    <RangePicker
      disabledDate={disabledDate}
      format="YYYY-MM-DD"
      onChange={onChange}
      disabled={!isChecked}
    />
  );
};

export default DateOption;
