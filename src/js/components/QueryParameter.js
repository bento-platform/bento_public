// Dashboard.js
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'

import { 
    Input,
    Select, 
    Checkbox,
    InputNumber
} from 'antd';
import "antd/dist/antd.css";

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
            checked: false
        };
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
        this.setState({
            rangeMin: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, newValue, this.state.rangeMax)
    }

    handleRangeMaxChange = (newValue) => {
        this.setState({
            rangeMax: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, this.state.rangeMin, newValue)
    }
    
    
    render() {
        const { Item, queryParameterCheckedStack, maxQueryParameters } = this.props;

        var This = this
        if (Item.queryable === true){
            return (
                <Row style={{margin: "1rem"}}>
                    <Col xs={{ span: 2, offset: 2  }}>
                        <Checkbox 
                            checked={This.state.checked} 
                            onChange={e => This.handleCheckboxChange(e)}
                            disabled={queryParameterCheckedStack.length >= maxQueryParameters && !This.state.checked}></Checkbox>
                    </Col>
                    <Col xs={{ span: 4 }} md={{ span: 2 }}>{Item.title}</Col>
                    <Col xs={{ span: 4 }}>
                    {
                        function(){
                            if (Item.type == "string") {
                                if (Item.enum != undefined) {
                                    return <Select
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
                                            <InputNumber id="range-min" name="range" 
                                                value={This.state.rangeMin}
                                                step={Item.bin_size}
                                                min="0" 
                                                max={This.state.rangeMax - Item.bin_size} 
                                                disabled={!This.state.checked}
                                                style={{maxWidth: "100%"}} 
                                                onChange={e => This.handleRangeMinChange(e)}/>
                                        </Col>
                                        <Col xs={{ span: 4 }} style={{textAlign: "center"}}>to</Col>
                                        <Col xs={{ span: 4 }}>
                                            <InputNumber id="range-max" name="range" 
                                                value={This.state.rangeMax}
                                                step={Item.bin_size}
                                                min={This.state.rangeMin + Item.bin_size} 
                                                disabled={!This.state.checked}
                                                style={{maxWidth: "100%"}} 
                                                onChange={e => This.handleRangeMaxChange(e)}/>
                                        </Col>
                                    </Row>
                                } else {
                                    return <InputNumber id="number" name="number" 
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