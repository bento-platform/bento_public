// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { JsonFormatter } from 'react-json-formatter'
import { Row, Col } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

import QueryParameter from './QueryParameter'

import { queryableFieldsUrl, katsuUrl } from "../constants"
import { 
    makeGetQueryableFieldsRequest, 
    makeGetOverviewRequest,
    makeGetKatsuPublic ,
    addQueryParameterToCheckedStack, 
    removeQueryParameterFromCheckedStack
} from "../action";

    
import Header from "./Header.js"

import { VictoryPie } from 'victory';


class Dashboard extends React.Component {

    constructor(props) {
        super(props)
    
        // fetch data from server
        this.props.makeGetQueryableFieldsRequest(queryableFieldsUrl);
    }
    
    fetchData() {
        // fetch data from server
        this.props.makeGetOverviewRequest(katsuUrl);
    }

    queryKatsuPublic() {
        // fetch data from server
        this.props.makeGetKatsuPublic();
    }

    render() {
        const { 
            queryableFields, 
            overview, 
            isFetchingData,
            queryParameterStack } = this.props;

        return (
            <Container>
                <Row>
                    <Header/>
                </Row>
                <Row>
                    <span>Search Stuff :</span>
                </Row>
                <Row>
                    {
                        // verify 'queryParameterStack'
                        typeof queryParameterStack == undefined || queryParameterStack.length === 0 
                        ? // display nothing if there is no data
                        <span>Nothing here...</span> 
                        :
                        <div>
                            {queryParameterStack}
                        </div>
                    }
                </Row>
                <Row>
                    <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                        <Button variant="primary" onClick={() => this.queryKatsuPublic()} disabled={isFetchingData}>Get Data</Button>
                        <Spinner animation="border" hidden={!isFetchingData}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 4, offset: 4 }}>
                        {
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
                        }
                    </Col>
                </Row>
            </Container>
        );
	}
}

const mapDispatchToProps = {
    makeGetQueryableFieldsRequest,
    makeGetOverviewRequest,
    makeGetKatsuPublic,
    addQueryParameterToCheckedStack,
    removeQueryParameterFromCheckedStack
}

const mapStateToProps = state => ({
	queryableFields: state.queryableFields,
	overview: state.overview,
	isFetchingData: state.isFetchingData,

    queryParameterStack: state.queryParameterStack
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);