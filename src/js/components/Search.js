// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { JsonFormatter } from 'react-json-formatter'
import { Row, Col } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

// do not remove, needed even though not referenced here
import QueryParameter from './QueryParameter'

import { 
    makeGetConfigRequest,
    makeGetOverviewRequest,
    makeGetQueryableFieldsRequest, 
    makeGetKatsuPublic,
} from "../action";


class Search extends React.Component {

    constructor(props) {
        super(props)
    }

    queryKatsuPublic() {
        // fetch data from server
        this.props.makeGetKatsuPublic();
    }

    render() {
        const { 
            queryResponseData, 
            isFetchingData,
            queryParameterStack } = this.props;

        return (
            <Container>
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
}

const mapStateToProps = state => ({
	queryResponseData: state.queryResponseData,
	isFetchingData: state.isFetchingData,
    queryParameterStack: state.queryParameterStack
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);