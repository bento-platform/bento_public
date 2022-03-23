// Dashboard.js
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'
import moment from "moment";

import { 
    Input,
    Select, 
    Checkbox,
    InputNumber,
    DatePicker,
    Tooltip
} from 'antd';
import "antd/dist/antd.css";
import { QuestionCircleOutlined } from '@ant-design/icons';

import Header from "./Header.js"

import { 
    addQueryParameterToCheckedStack, 
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack 
} from "../action";
import { 
    debuglog
} from "../utils"
 

class QueryParameter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            rangeMin: 0,
            rangeMax: 1 * props.Item.bin_size,
            dateAfter: '',
            dateBefore: '',
            checked: false,
            error: false,
        };
    }

    disabledDateAfter = (current) => {
        if (this.state.dateBefore != '') {
            return current && current > moment(this.state.dateBefore, "YYYY-MM-DD");
        }
        return false
    }

    disabledDateBefore = (current) => {
        if (this.state.dateAfter != '') {
            return current && current < moment(this.state.dateAfter, "YYYY-MM-DD");
        }
        return false
    }

    handleCheckboxChange = (e) => {
        var checked = e.target.checked

        if (checked) {
            debuglog("Checked")
            if (this.props.Item.type == "number"){
                this.props.addQueryParameterToCheckedStack(this.props.Item, undefined, this.state.rangeMin, this.state.rangeMax)
            }
            else {
                this.props.addQueryParameterToCheckedStack(this.props.Item, this.state.inputValue)
            }
        } else {
            debuglog("Not checked")
            this.props.removeQueryParameterFromCheckedStack(this.props.Item)
        }

        this.setState({
            checked: checked
        })
    }

    handleValueChange = (e) => {
        const newValue = e.target.value;
        this.setState({
            inputValue: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue)
    }

    handleAntdSelectValueChange = (newValue) => {
        this.setState({
            inputValue: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue)
    }

    handleRangeMinChange = (newValue) => {
        // Floor to the nearest bin_size
        if (this.props.Item.type == "number" && this.props.Item.bin_size != undefined) {
            var diff = newValue % this.props.Item.bin_size
            newValue = newValue - diff
        }

        this.setState({
            rangeMin: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, newValue, this.state.rangeMax)
    }

    handleRangeMaxChange = (newValue) => {
        // Floor to the nearest bin_size
        if (this.props.Item.type == "number" && this.props.Item.bin_size != undefined) {
            var diff = newValue % this.props.Item.bin_size
            newValue = newValue - diff
        }
        
        this.setState({
            rangeMax: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, this.state.rangeMin, newValue)
    }
    
    handleDateAfterChange = (newDate) => {
        console.log(newDate)
        var ndFmt = ''

        if (newDate !== null) {
            var ndFmt =  newDate.format("YYYY-MM-DD")
            var newD = new Date(ndFmt)
            // check date range mismatch
            var currentDateBefore = this.state.dateBefore
            var currentDateBeforeDate = new Date(this.state.dateBefore)

            if (newD > currentDateBeforeDate) {
                console.log("error: new date is after current 'before' date")
                this.setState({
                    error: true
                }); 
                return
            }
        }
        
        this.setState({
            dateAfter: ndFmt
        });
        

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, undefined, 
            undefined, undefined, 
            ndFmt, currentDateBefore)
    }
    handleDateBeforeChange = (newDate) => {
        console.log(newDate)
        var ndFmt = ''
        if (newDate !== null) {
            ndFmt =  newDate.format("YYYY-MM-DD")
            var newD = new Date(ndFmt)
            // check date range mismatch
            var currentDateAfter = this.state.dateAfter
            var currentDateAfterDate = new Date(this.state.dateAfter)
    
            if (newD < currentDateAfterDate) {
                console.log("error: new date is before current 'after' date")
                this.setState({
                    error: true
                }); 
                return
            }
        }
        
        this.setState({
            dateBefore: ndFmt
        });
        

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, undefined, 
            undefined, undefined, 
            currentDateAfter, ndFmt)
    }
    
    
    render() {
        const { Item, queryParameterCheckedStack, maxQueryParameters } = this.props;

        var This = this
        if (Item.queryable === true){
            return (
                <Row style={{margin: "1rem"}}>
                    <Col xs={{ span: 2, offset: 2  }}>
                        <Checkbox id={Item.key}
                            checked={This.state.checked} 
                            onChange={e => This.handleCheckboxChange(e)}
                            disabled={queryParameterCheckedStack.length >= maxQueryParameters && !This.state.checked}></Checkbox>
                    </Col>
                    <Col xs={{ span: 3 }} md={{ span: 2 }}>
                        {Item.title}
                    </Col>
                    <Col xs={{ span: 1 }}>
                        <Tooltip placement="right" title={Item.description}>
                            <QuestionCircleOutlined />
                        </Tooltip>    
                    </Col>                    
                    <Col xs={{ span: 4 }}>
                    {
                        function(){
                            let _minimum =  Item.minimum != undefined ? Item.minimum : -Infinity
                            let _maximum =  Item.maximum != undefined ? Item.maximum : Infinity
                            

                            if (Item.type == "string") {
                                // if date
                                if (Item.format != undefined && Item.format == "date") {
                                    return <Row>
                                        <Col xs={{ span: 5 }}>
                                            <DatePicker id={Item.key} key={Item.key} name="date-after"
                                                disabled={!This.state.checked}
                                                disabledDate={This.disabledDateAfter}
                                                status={This.state.error ? "error" : ""}
                                                onChange={This.handleDateAfterChange} />
                                        </Col>
                                        <Col xs={{ span: 2 }} style={{textAlign: "center"}}>to</Col>
                                        <Col xs={{ span: 5 }}>
                                            <DatePicker id={Item.key} key={Item.key} name="date-before"
                                                disabled={!This.state.checked}
                                                disabledDate={This.disabledDateBefore}
                                                status={This.state.error ? "error" : ""}
                                                onChange={This.handleDateBeforeChange} />
                                        </Col>
                                    </Row>
                                }
                                else if (Item.enum != undefined) {

                                    return <Select id={Item.key}
                                        disabled={!This.state.checked}
                                        showSearch
                                        style={{ width: "100%" }}
                                        onChange={e => This.handleAntdSelectValueChange(e)} >
                                        <Select.Option key={Item.key} value=""></Select.Option>
                                        {Item.enum.map((item) =><Select.Option key={item} value={item.key}>{item}</Select.Option>)}
                                    </Select>
                                } else {
                                    return <Input onChange={e => This.handleValueChange(e)} disabled={!This.state.checked} />
                                }
                            } else if(Item.type == "number"){
                                if (Item.is_range != undefined && Item.is_range) {
                                    return <Row>
                                        <Col xs={{ span: 4 }}>
                                            <InputNumber id={Item.key} name="range-min"
                                                value={This.state.rangeMin}
                                                step={Item.bin_size}
                                                min={_minimum} 
                                                max={This.state.rangeMax - Item.bin_size} 
                                                disabled={!This.state.checked}
                                                style={{maxWidth: "100%"}} 
                                                onChange={e => This.handleRangeMinChange(e)}/>
                                        </Col>
                                        <Col xs={{ span: 4 }} style={{textAlign: "center"}}>to</Col>
                                        <Col xs={{ span: 4 }}>
                                            <InputNumber id={Item.key} name="range-max" 
                                                value={This.state.rangeMax}
                                                step={Item.bin_size}
                                                min={This.state.rangeMin + Item.bin_size} 
                                                max={_maximum} 
                                                disabled={!This.state.checked}
                                                style={{maxWidth: "100%"}} 
                                                onChange={e => This.handleRangeMaxChange(e)}/>
                                        </Col>
                                    </Row>
                                } else {
                                    return <InputNumber id={Item.key} name="number" 
                                        value={This.state.value}
                                        disabled={!This.state.checked}
                                        style={{maxWidth: "100%"}} 
                                        onChange={e => This.handleValueChange(e)}/>
                                }
                            } else {
                                return <Input onChange={e => This.handleValueChange(e)} disabled={!This.state.checked} />
                            }
                        
                        }()
                    }
                    </Col>
                    <Col>
                        <span>{Item.units}</span>
                    </Col>
                </Row>
            );
        } 
        
        return <></>
	}
}

QueryParameter.propTypes = {
    Item: PropTypes.any,
    queryParameterCheckedStack: PropTypes.array
};

const mapDispatchToProps = {
    addQueryParameterToCheckedStack,
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack
}

const mapStateToProps = state => ({
    maxQueryParameters: state.config.maxQueryParameters,
    queryParameterCheckedStack: state.queryParameterCheckedStack
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryParameter);