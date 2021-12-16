// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap'

import { dataUrl } from "../constants"
import { appendData, makeGetRequest } from "../action";

import Header from "./Header.js"

import { VictoryPie } from 'victory';

class Dashboard extends React.Component {

    componentDidMount() {}

    fetchData() {
        // fetch data from server
        this.props.makeGetRequest(dataUrl);
    }

    render() {
        const { phenopackets } = this.props;

        return (
            <Container>
                <Row>
                    <Header/>
                </Row>
                <Row>
                    {phenopackets.length > 0 
                        ? 
                        <Col className="text-center" md={{ span: 8, offset: 2 }}>
                            <VictoryPie
                                data={phenopackets}
                                // data accessor for x values
                                x="age"
                                // data accessor for y values
                                y="age"
                            />
                        </Col>: <></>}
                </Row>
                <Row>
                    <Col className="text-center" xs={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
                        <Button variant="primary" onClick={() => this.fetchData()}>Get Data</Button>
                    </Col>
                </Row>
            </Container>
        );
	}
}

const mapDispatchToProps = {
	appendData,
	makeGetRequest
}

const mapStateToProps = state => ({
	phenopackets: state.phenopackets
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);