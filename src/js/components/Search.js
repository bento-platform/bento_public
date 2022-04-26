// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap'
import SearchResults from "./SearchResults";

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
                  typeof queryParameterStack == undefined || queryParameterStack.length === 0 ? (
                    // display nothing if there is no data
                    <span>Nothing here...</span>
                  ) : (
                    <div>{queryParameterStack}</div>
                  )
                }
              </Col>
            </Row>
            <Row>
              <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                <Button variant="primary" onClick={() => this.queryKatsuPublic()} disabled={isFetchingData}>
                  Get Data
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <SearchResults queryResponseData={queryResponseData} isFetchingData={isFetchingData} />
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