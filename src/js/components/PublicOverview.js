// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'
import { JsonFormatter } from 'react-json-formatter'

import { VictoryPie } from 'victory';

class PublicOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
 
        };
    }    
    
    render() {
        const { overview } = this.props;
        return (
            <>
                {
                    // verify 'overview'
                    typeof overview == undefined || Object.keys(overview).length === 0 
                    ? // display message if there is no data
                    <></> 
                    : // display the available data 
                    <Row>
                        {
                            Object.values(overview)
                                .map((item) => {
                                    return Object.keys(item).map(function(key) {              
                                        // accumulate all pie charts in a single array
                                        var qpList = [];
                                        Object.keys(item[key]).forEach(function(_key) {              
                                            qpList.push({x: _key, y:item[key][_key]})
                                        });
                                        
                                        return <Col key={key} sm={12} md={6} lg={4} style={{height: "100%"}}>
                                            <h3 style={{textAlign:"center"}}>{key}</h3>
                                            {/* TODO: upgrade pie chart / visualization library */}
                                            <VictoryPie 
                                                data={qpList} 
                                                width={200} height={200} 
                                                style={{
                                                    labels: {
                                                      fontSize: 6
                                                    }
                                                }}
                                                />
                                        </Col>
                                    });
                                })
                        }
                    </Row>
                }
            </>
        );
	}
}

const mapDispatchToProps = {
}

const mapStateToProps = state => ({
    overview: state.overview
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicOverview);