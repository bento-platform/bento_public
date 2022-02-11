// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'

import { Select, Checkbox } from 'antd';
import "antd/dist/antd.css";


import Header from "./Header.js"

import { 
    addQueryParameterToCheckedStack, 
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack 
} from "../action";

 

class QueryParameter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            rangeMin: 0,
            rangeMax: 0,
        };
    }

    handleCheckboxChange = (e) => {
        var checked = e.target.checked

        if (checked) {
            console.log("Checked")
            if (this.props.Item.type == "range"){
                this.props.addQueryParameterToCheckedStack(this.props.Item, undefined, this.state.rangeMin, this.state.rangeMax)
            }
            else {
                this.props.addQueryParameterToCheckedStack(this.props.Item, this.state.inputValue)
            }
        } else {
            console.log("Not checked")
            this.props.removeQueryParameterFromCheckedStack(this.props.Item)
        }
    }

    handleValueChange = (e) => {
        const newValue = e.target.value;
        this.setState({
            inputValue: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue)
    }

    handleAntdSelectValueChange = (e) => {
        this.setState({
            inputValue: e
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, e)
    }

    handleRangeMinChange = (e) => {
        const newValue = e.target.value;
        this.setState({
            rangeMin: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, newValue, this.state.rangeMax)
    }

    handleRangeMaxChange = (e) => {
        const newValue = e.target.value;
        this.setState({
            rangeMax: newValue
        });

        this.props.updateQueryParameterValueInCheckedStack(this.props.Item, newValue, this.state.rangeMin, newValue)
    }
    
    
    render() {
        const { Item } = this.props;
        var This = this
        return (
            <Row style={{margin: "1rem"}}>
                <Col xs={{ span: 2, offset: 2  }}>
                    <Checkbox value={Item.term} onChange={e => this.handleCheckboxChange(e)}></Checkbox>
                </Col>
                <Col xs={{ span: 4 }}>{Item.term}</Col>
                <Col xs={{ span: 4 }}>{
                    function(){
                    if (Item.type == "enum") {
                        return <Select
                            showSearch
                            style={{ width: "100%" }}
                            onChange={e => This.handleAntdSelectValueChange(e)} >
                            <Select.Option key={Item.key} value=""></Select.Option>
                            {Item.values.map((item) =><Select.Option key={item} value={item.key}>{item}</Select.Option>)}
                        </Select>
                    } else if(Item.type == "range"){
                        return <Row>
                            <Col xs={{ span: 4 }}>
                                <input type="number" id="range-min" name="range" min="0" style={{maxWidth: "100%"}} onChange={e => This.handleRangeMinChange(e)}/>
                            </Col>
                            <Col xs={{ span: 4 }} style={{textAlign: "center"}}>to</Col>
                            <Col xs={{ span: 4 }}>
                                <input type="number" id="range-max" name="range" min="0" style={{maxWidth: "100%"}} onChange={e => This.handleRangeMaxChange(e)}/>
                            </Col>
                        </Row>
                    } else {
                        return <input
                            type="text"
                            onChange={e => This.handleValueChange(e)}
                        />
                    }
                }()}</Col>
            </Row>
        );
	}
}

const mapDispatchToProps = {
    addQueryParameterToCheckedStack,
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryParameter);