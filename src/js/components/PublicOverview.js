// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col } from 'react-bootstrap'
import { JsonFormatter } from 'react-json-formatter'

import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis } from 'victory';

class PublicOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
 
        };
    }    

    render() {
        const { overview, queryParameterStack } = this.props;
        // type check
        if ( typeof overview != undefined && Object.keys(overview).length > 0 ) {
            var ov = overview.overview;
            var ep = overview.overview.extra_properties
            
            // aggregate separate items within overview (extra_properties and non-extra_properties)
            // as one object to facilitate looping
            var all_vars = Object.assign({}, ov, ep)
        }

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
                            // iterate over all key-value pairs
                            Object.entries(all_vars)
                                // .map returns an array containing all items returned 
                                // from each function call (i.e, an array of pie charts)
                                .map((item) => {
                                    let key = item[0]
                                    let value = item[1]

                                    // skip extra_properties and only iterate over actual objects
                                    if (key != "extra_properties" && Object.prototype.toString.call(value) === '[object Object]') {

                                        // accumulate all pie chart data-points
                                        var qpList = [];
                                        Object.keys(value).forEach(function(_key) {   
                                            qpList.push({x: _key, y:value[_key]})
                                        });

                                        // determine title
                                        var title = queryParameterStack.find(e => e.hasOwnProperty("key") && e.key == key)?.props?.Item?.title ?? "-"
                                        var type = queryParameterStack.find(e => e.hasOwnProperty("key") && e.key == key)?.props?.Item?.type ?? "-"
                                        var chart = queryParameterStack.find(e => e.hasOwnProperty("key") && e.key == key)?.props?.Item?.chart ?? "-"


                                        {/* TODO: upgrade pie chart & histograms / visualization library */}
                                        if (type == "number") {
                                            // return histogram
                                            return <Col key={key} md={12} lg={6} style={{height: "100%"}}>
                                                <h3 style={{textAlign:"center"}}>{title}</h3>
                                                <VictoryChart
                                                    domainPadding={10}
                                                >
                                                    <VictoryAxis
                                                        style={{ 
                                                            tickLabels: { fontSize: 10 , angle: -45}
                                                        }}
                                                    />
                                                    <VictoryBar
                                                        style={{ data: { fill: "#c43a31" } }}
                                                        x="x"
                                                        y="y"
                                                        data={qpList}
                                                />
                                                </VictoryChart>
                                            </Col>
                                        } else {
                                            if (chart == "bar"){
                                                // return histogram
                                                return <Col key={key} md={12} lg={6} style={{height: "100%"}}>
                                                    <h3 style={{textAlign:"center"}}>{title}</h3>
                                                    <VictoryChart
                                                        domainPadding={10}
                                                    >
                                                        <VictoryAxis
                                                            style={{ 
                                                                tickLabels: { fontSize: 10 , angle: -45}
                                                            }}
                                                        />
                                                        <VictoryBar
                                                            style={{ data: { fill: "#c43a31" } }}
                                                            x="x"
                                                            y="y"
                                                            data={qpList}
                                                    />
                                                    </VictoryChart>
                                                </Col>
                                            } else {
                                                // default

                                                // return pie chart
                                                return <Col key={key} sm={12} md={6} lg={4} style={{height: "100%"}}>
                                                    <h3 style={{textAlign:"center"}}>{title}</h3>
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
                                            }

                                        }
                                        
                                    }
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
    overview: state.overview,
    queryParameterStack: state.queryParameterStack
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicOverview);