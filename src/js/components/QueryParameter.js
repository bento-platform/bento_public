// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'

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
            inputValue: ''
        };
    }

    handleCheckboxChange = (e) => {
        var checked = e.target.checked

        if (checked) {
            console.log("Checked")
            this.props.addQueryParameterToCheckedStack(this.props.Item, this.state.inputValue)
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
    
    
    render() {
        const { Item } = this.props;
        var This = this
        return (
            <Row style={{margin: "1rem"}}>
                <Col xs={{ span: 2, offset: 2  }}><input type="checkbox" value={Item.term} onChange={e => this.handleCheckboxChange(e)} /> </Col>
                <Col xs={{ span: 4 }}>{Item.term}</Col>
                <Col xs={{ span: 4 }}>{
                    function(){
                    if (Item.type == "enum") {
                        return <select key={Item.term} name="values" onChange={e => This.handleValueChange(e)}>
                            <option value="" ></option>
                            {Item.values.map((item) => <option value={item.key} >{item}</option>)}
                        </select>
                    } else {
                        return <input
                            type="text"
                            // value={this.state.value}
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