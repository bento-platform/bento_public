// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { JsonFormatter } from 'react-json-formatter'
import { Row, Col } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

import PublicOverview from './PublicOverview'
import QueryParameter from './QueryParameter'

import { 
    configUrl,
    publicOverviewUrl,
    queryableFieldsUrl, 
    katsuUrl 
} from "../constants"

import { 
    makeGetConfigRequest,
    makeGetOverviewRequest,
    makeGetQueryableFieldsRequest, 
    makeGetKatsuPublic,

    addQueryParameterToCheckedStack, 
    removeQueryParameterFromCheckedStack
} from "../action";




class Dashboard extends React.Component {

    constructor(props) {
        super(props)
    
        // fetch data from server
        this.props.makeGetConfigRequest(configUrl);
        this.props.makeGetOverviewRequest(publicOverviewUrl);
        this.props.makeGetQueryableFieldsRequest(queryableFieldsUrl);
    }

    queryKatsuPublic() {
        // fetch data from server
        this.props.makeGetKatsuPublic();
    }

    render() {
        const { 
            queryableFields, 
            queryResponseData, 
            isFetchingData,
            isFetchingConfig,
            isFetchingFields,
            isFetchingOverview,
            queryParameterStack } = this.props;

        return (
            <Container>
                <Row>
                    <Col>
                        <h2>Overview: </h2>
                        <Spinner animation="border" hidden={!isFetchingConfig && !isFetchingFields && !isFetchingOverview}/>

                        <PublicOverview/>
                    </Col>
                </Row>
                <Row>
                    <span>Search :</span>
                </Row>
                <Row>
                    <Col sm={{ span: 10 }}>
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
                    </Col>
                    <Col md={{ span: 2 }}>
                        {
                            // verify 'queryResponseData'
                            typeof queryResponseData == undefined || Object.keys(queryResponseData).length === 0 
                            ? // display message if there is no data
                            <></> 
                            : // display the available data 
                            <JsonFormatter 
                                json={JSON.stringify(queryResponseData)} 
                                tabWith='4' 
                                JsonStyle={{
                                    propertyStyle: { color: 'red' },
                                    stringStyle: { color: 'green' },
                                    numberStyle: { color: 'darkorange' }
                                }} />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                        <Button variant="primary" onClick={() => this.queryKatsuPublic()} disabled={isFetchingData}>Get Data</Button>
                        <Spinner animation="border" hidden={!isFetchingData}/>
                    </Col>
                </Row>
            </Container>
        );
	}
}

const mapDispatchToProps = {
    makeGetConfigRequest,
    makeGetQueryableFieldsRequest,
    makeGetOverviewRequest,
    makeGetKatsuPublic,
    addQueryParameterToCheckedStack,
    removeQueryParameterFromCheckedStack
}

const mapStateToProps = state => ({
	queryableFields: state.queryableFields,
	queryResponseData: state.queryResponseData,
	isFetchingData: state.isFetchingData,
	isFetchingConfig: state.isFetchingConfig,
	isFetchingOverview: state.isFetchingOverview,
	isFetchingFields: state.isFetchingFields,

    queryParameterStack: state.queryParameterStack
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);