// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'
import { JsonFormatter } from 'react-json-formatter'


class PublicOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
 
        };
    }    
    
    render() {
        const { overview } = this.props;
        return (
            <>{
                // verify 'overview'
                typeof overview == undefined || Object.keys(overview).length === 0 
                ? // display message if there is no data
                <></> 
                : // display the available data 
                <JsonFormatter 
                    json={JSON.stringify(overview)} 
                    tabWith='4' 
                    JsonStyle={{
                        propertyStyle: { color: 'red' },
                        stringStyle: { color: 'green' },
                        numberStyle: { color: 'darkorange' }
                    }} />
            }</>
        );
	}
}

const mapDispatchToProps = {
}

const mapStateToProps = state => ({
    overview: state.overview
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicOverview);