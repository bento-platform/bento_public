// Dashboard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import {
  Input,
  Select,
  Checkbox,
  InputNumber,
  DatePicker,
  Tooltip,
} from 'antd';
import 'antd/dist/antd.css';
import { QuestionCircleOutlined } from '@ant-design/icons';

import {
  addQueryParameterToCheckedStack,
  updateQueryParameterValueInCheckedStack,
  removeQueryParameterFromCheckedStack,
} from '../../action';
import { debuglog } from '../../utils';

const QueryParameter = ({
  Item,
  queryParameterCheckedStack,
  maxQueryParameters,
}) => {
  const [state, setState] = useState({
    inputValue: '',
    rangeMin: 0,
    rangeMax: 1 * Item.bin_size,
    dateAfter: '',
    dateBefore: '',
    checked: false,
    error: false,
  });

  const disabledDateAfter = (current) => {
    // TODO: disable dates earlier than first date in dataset
    if (state.dateBefore != '') {
      return (
        current &&
        (current > moment(state.dateBefore, 'YYYY-MM-DD') || current > moment())
      );
    } else {
      return current && current > moment(); // disable dates later than today
    }
  };

  const disabledDateBefore = (current) => {
    // TODO: disable dates earlier than first date in dataset
    if (state.dateAfter != '') {
      return (
        current &&
        (current < moment(state.dateAfter, 'YYYY-MM-DD') || current > moment())
      );
    } else {
      return current && current > moment(); // disable dates later than today
    }
  };

  const handleCheckboxChange = (e) => {
    var checked = e.target.checked;

    if (checked) {
      debuglog('Checked');
      if (Item.type == 'number') {
        // this.props.addQueryParameterToCheckedStack(
        //   Item,
        //   undefined,
        //   state.rangeMin,
        //   state.rangeMax
        // );
      } else {
        // this.props.addQueryParameterToCheckedStack(
        // Item,
        //   state.inputValue
        // );
      }
    } else {
      debuglog('Not checked');
      //   this.props.removeQueryParameterFromCheckedStack(Item);
    }

    setState({
      ...state,
      checked: checked,
    });
  };

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setState({ ...state, inputValue: newValue });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   newValue
    // );
  };

  const handleAntdSelectValueChange = (newValue) => {
    setState({ ...state, inputValue: newValue });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   newValue
    // );
  };

  const handleRangeMinChange = (newValue) => {
    // Floor to the nearest bin_size
    if (Item.type == 'number' && Item.bin_size != undefined) {
      var diff = newValue % Item.bin_size;
      newValue = newValue - diff;
    }

    setState({ ...state, rangeMin: newValue });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   newValue,
    //   newValue,
    //   state.rangeMax
    // );
  };

  const handleRangeMaxChange = (newValue) => {
    // Floor to the nearest bin_size
    if (Item.type == 'number' && Item.bin_size != undefined) {
      var diff = newValue % Item.bin_size;
      newValue = newValue - diff;
    }

    setState({ ...state, rangeMax: newValue });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   newValue,
    //   state.rangeMin,
    //   newValue
    // );
  };

  const handleDateAfterChange = (newDate) => {
    console.log(newDate);
    var ndFmt = '';

    if (newDate !== null) {
      var ndFmt = newDate.format('YYYY-MM-DD');
      var newD = new Date(ndFmt);
      // check date range mismatch
      var currentDateBefore = state.dateBefore;
      var currentDateBeforeDate = new Date(state.dateBefore);

      if (newD > currentDateBeforeDate) {
        console.log("error: new date is after current 'before' date");
        setState({ ...state, error: true });
        return;
      }
    }

    setState({ ...state, dateAfter: ndFmt });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   undefined,
    //   undefined,
    //   undefined,
    //   ndFmt,
    //   currentDateBefore
    // );
  };
  const handleDateBeforeChange = (newDate) => {
    console.log(newDate);
    var ndFmt = '';
    if (newDate !== null) {
      ndFmt = newDate.format('YYYY-MM-DD');
      var newD = new Date(ndFmt);
      // check date range mismatch
      var currentDateAfter = state.dateAfter;
      var currentDateAfterDate = new Date(state.dateAfter);

      if (newD < currentDateAfterDate) {
        console.log("error: new date is before current 'after' date");
        setState({ ...state, error: true });
        return;
      }
    }

    setState({ ...state, dateBefore: ndFmt });

    // this.props.updateQueryParameterValueInCheckedStack(
    // Item,
    //   undefined,
    //   undefined,
    //   undefined,
    //   currentDateAfter,
    //   ndFmt
    // );
  };

  if (Item.data.queryable) {
    return (
      <Row style={{ margin: '1rem' }}>
        <Col xs={{ span: 2, offset: 2 }}>
          <Checkbox
            id={Item.name}
            checked={state.checked}
            onChange={(e) => handleCheckboxChange(e)}
            // disabled={
            //   this.props.queryParameterCheckedStack.length >= maxQueryParameters &&
            //   !state.checked
            // }
          />
        </Col>
        <Col xs={{ span: 3 }} md={{ span: 2 }}>
          {Item.data.title}
        </Col>
        <Col xs={{ span: 1 }}>
          <Tooltip placement="topLeft" title={Item.data.description}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Col>
        <Col xs={{ span: 4 }}>
          {(function () {
            let _minimum =
              Item.data.minimum != undefined ? Item.data.minimum : -Infinity;
            let _maximum =
              Item.data.maximum != undefined ? Item.data.maximum : Infinity;

            if (Item.data.type == 'string') {
              // if date
              if (Item.data.format != undefined && Item.data.format == 'date') {
                return (
                  <Row>
                    <Col xs={{ span: 5 }}>
                      <DatePicker
                        id={Item.name}
                        key={Item.name}
                        name="date-after"
                        disabled={!state.checked}
                        disabledDate={disabledDateAfter}
                        status={state.error ? 'error' : ''}
                        onChange={handleDateAfterChange}
                      />
                    </Col>
                    <Col xs={{ span: 2 }} style={{ textAlign: 'center' }}>
                      to
                    </Col>
                    <Col xs={{ span: 5 }}>
                      <DatePicker
                        id={Item.name}
                        key={Item.name}
                        name="date-before"
                        disabled={!state.checked}
                        disabledDate={disabledDateBefore}
                        status={state.error ? 'error' : ''}
                        onChange={handleDateBeforeChange}
                      />
                    </Col>
                  </Row>
                );
              } else if (Item.data.enum != undefined) {
                return (
                  <Select
                    id={Item.name}
                    disabled={!state.checked}
                    showSearch
                    style={{ width: '100%' }}
                    onChange={(e) => handleAntdSelectValueChange(e)}
                  >
                    <Select.Option key={Item.name} value=""></Select.Option>
                    {Item.data.enum.map((item) => (
                      <Select.Option key={item} value={Item.name}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                );
              } else {
                return (
                  <Input
                    onChange={(e) => handleValueChange(e)}
                    disabled={!state.checked}
                  />
                );
              }
            } else if (Item.data.type == 'number') {
              if (Item.data.is_range != undefined && Item.data.is_range) {
                return (
                  <Row>
                    <Col xs={{ span: 4 }}>
                      <InputNumber
                        id={Item.name}
                        name="range-min"
                        value={state.rangeMin}
                        step={Item.data.bin_size}
                        min={_minimum}
                        max={state.rangeMax - Item.data.bin_size}
                        disabled={!state.checked}
                        style={{ maxWidth: '100%' }}
                        onChange={(e) => handleRangeMinChange(e)}
                      />
                    </Col>
                    <Col xs={{ span: 4 }} style={{ textAlign: 'center' }}>
                      to
                    </Col>
                    <Col xs={{ span: 4 }}>
                      <InputNumber
                        id={Item.name}
                        name="range-max"
                        value={state.rangeMax}
                        step={Item.data.bin_size}
                        min={state.rangeMin + Item.data.bin_size}
                        max={_maximum}
                        disabled={!state.checked}
                        style={{ maxWidth: '100%' }}
                        onChange={(e) => handleRangeMaxChange(e)}
                      />
                    </Col>
                  </Row>
                );
              } else {
                return (
                  <InputNumber
                    id={Item.name}
                    name="number"
                    value={state.value}
                    disabled={!state.checked}
                    style={{ maxWidth: '100%' }}
                    onChange={(e) => handleValueChange(e)}
                  />
                );
              }
            } else {
              return (
                <Input
                  onChange={(e) => handleValueChange(e)}
                  disabled={!state.checked}
                />
              );
            }
          })()}
        </Col>
        <Col>
          <span>{Item.units}</span>
        </Col>
      </Row>
    );
  }

  return <></>;
};

QueryParameter.propTypes = {
  Item: PropTypes.any,
  queryParameterCheckedStack: PropTypes.array,
};

const mapDispatchToProps = {
  addQueryParameterToCheckedStack,
  updateQueryParameterValueInCheckedStack,
  removeQueryParameterFromCheckedStack,
};

const mapStateToProps = (state) => ({
  maxQueryParameters: state.config.maxQueryParameters,
  queryParameterCheckedStack: state.queryParameterCheckedStack,
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryParameter);
