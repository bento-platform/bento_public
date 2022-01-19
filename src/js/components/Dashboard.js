// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap'

import { JsonFormatter } from 'react-json-formatter'

import { dataUrl, katsuUrl } from "../constants"
import { makeGetRequest, makeGetOverviewRequest } from "../action";

import Header from "./Header.js"

import { VictoryPie } from 'victory';

class Dashboard extends React.Component {

    componentDidMount() {}

    fetchData() {
        // fetch data from server
        this.props.makeGetRequest(dataUrl);
        this.props.makeGetOverviewRequest(katsuUrl);
    }

    render() {
        const { phenopackets, overview } = this.props;
        
        return (
            <Container>
                <Row>
                    <Header/>
                </Row>
                <Row>
                    <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                        <Button variant="primary" onClick={() => this.fetchData()}>Get Data</Button>
                    </Col>
                </Row>
                <Row>
                    <span>Phenopackets :</span>
                    <Col md={{ span: 8, offset: 2 }}>
                        {
                            // verify 'phenopackets'
                            typeof phenopackets == undefined || phenopackets.length == 0 
                            ? 
                            <span>Nothing here...</span> 
                            :
                            <VictoryPie
                                data={phenopackets}
                                // data accessor for x values
                                x="age"
                                // data accessor for y values
                                y="age" />
                        }
                    </Col>
                </Row>
                <Row>
                    <span>Overview :</span>
                    <Col md={{ span: 8, offset: 2 }}>
                        {
                            // verify 'overview'
                            typeof overview == undefined || Object.keys(overview).length === 0 
                            ? // display message if there is no data
                            <span>Nothing here...</span> 
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
	makeGetRequest,
    makeGetOverviewRequest
}

const mapStateToProps = state => ({
	phenopackets: state.phenopackets,
	overview: state.overview
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);