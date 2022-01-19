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
        // TODO: refactor
        //          - simple overview data presentation PoC
        const experimentTypeData = [];
        const experimentLibrarySourceData = [];
        if (typeof overview != undefined && Object.keys(overview).length > 0) {
            // experiments
            var experiments = overview.data_type_specific.experiments;
            
            // get types
            var experimentTypes = experiments.experiment_type;
            var keys = Object.keys(experimentTypes);
            var values = Object.values(experimentTypes);
            for (var i = 0; i < keys.length; i++) {
                experimentTypeData.push({x: keys[i], y: values[i]})
            }

            // get library sources
            var experimentLibrarySources = experiments.library_source;
            var keys = Object.keys(experimentLibrarySources);
            var values = Object.values(experimentLibrarySources);
            for (var i = 0; i < keys.length; i++) {
                experimentLibrarySourceData.push({x: keys[i], y: values[i]})
            }
        }
        // --

        return (
            <Container>
                <Row>
                    <Header/>
                </Row>
                <Row>
                    <span>Overview :</span>
                </Row>
                <Row>
                    <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                        <Button variant="primary" onClick={() => this.fetchData()}>Get Data</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 8 }}>
                        <Row>
                            <span>Experiments</span>
                        </Row>
                        <Row>
                        {
                            // verify 'experimentTypeData'
                            typeof experimentTypeData == undefined || experimentTypeData.length === 0 
                            ? // display nothing if there is no data
                            <span>Nothing here...</span> 
                            :
                            <div>
                                <span>Types</span>
                                <VictoryPie
                                    width={800}
                                    data={experimentTypeData}
                                    // data accessor for x values
                                    x="x"
                                    // data accessor for y values
                                    y="y" />
                            </div>
                        }
                        </Row>
                        <Row>
                        {
                            // verify 'experimentLibrarySourceData'
                            typeof experimentLibrarySourceData == undefined || experimentLibrarySourceData.length === 0 
                            ? // display nothing if there is no data
                            <></> 
                            :
                            <div>
                                <span>Library Sources</span>
                                <VictoryPie
                                    width={800}
                                    data={experimentLibrarySourceData}
                                    // data accessor for x values
                                    x="x"
                                    // data accessor for y values
                                    y="y" />
                            </div>
                        }
                        </Row>
                    </Col>
                    <Col md={{ span: 4 }}>
                        <Row>
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
                        </Row>
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