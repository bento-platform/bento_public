// Dashboard.js
import React from "react";
import { connect } from "react-redux";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { Divider } from "antd";
import BentoPie from "./BentoPie";
import BentoBarChart from "./BentoBarChart";

const CHART_HEIGHT = 300;
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
          <Container>
            {
              // verify 'overview'
              typeof overview == undefined || Object.keys(overview).length === 0 ? (
                // display message if there is no data
                <div
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
                >
                  <Spinner animation="border" />
                </div>
              ) : (
                // display the available data
                <Row>
                  {
                    // iterate over all key-value pairs
                    Object.entries(all_vars)
                      // .map returns an array containing all items returned
                      // from each function call (i.e, an array of pie charts)
                      .map((item) => {
                        let key = item[0];
                        let value = item[1];

                        console.log({PUBLIC_CHART_ITEM: item})
                        const chartParams = queryParameterStack.find((e) => e.hasOwnProperty("key") && e.key == key)

                        console.log({chartParams: chartParams})
                        if (!chartParams){
                          return null
                        }

                        const field = chartParams.props?.Item;
                        const title = chartParams.props?.Item?.title ?? "-";
                        const type = chartParams.props?.Item?.type ?? "-";
                        const chart = chartParams.props?.Item?.chart ?? "-";
                        const units = chartParams.props?.Item?.units ?? "";

                        const qpList = [];

                        // skip extra_properties and only iterate over actual objects
                        if (
                          field != undefined &&
                          key != "extra_properties" &&
                          Object.prototype.toString.call(value) === "[object Object]"
                        ) {
                          // accumulate all pie chart data-points
                          var taperLeft = undefined;
                          var taperRight = undefined;
                          var leftTaper = 0;
                          var rightTaper = 0;
                          var binSize = 0;
                          var monthlybins = {};

                          if (field["bin_size"] != undefined) {
                            binSize = field["bin_size"];
                          }

                          if (field["taper_left"] != undefined) {
                            leftTaper = field["taper_left"];
                          }
                          if (field["taper_right"] != undefined) {
                            rightTaper = field["taper_right"];
                          }

                          if (field != undefined && field["type"] == "string" && field["format"] == "date") {
                            Object.keys(value).forEach(function (_key) {
                              var attemptedDate = new Date(_key);
                              var monthStr = attemptedDate.yyyydashmm();

                              // if not a valid date, add to "missing"
                              if (isNaN(attemptedDate.valueOf())) {
                                monthlybins["missing"] = (monthlybins["missing"] ?? 0) + value[_key];
                                return; //ie, continue
                              }

                              // verify if monthly bin exists - add to dict if not
                              if (monthlybins[monthStr] == undefined) {
                                monthlybins[monthStr] = value[_key];
                              } else {
                                monthlybins[monthStr] = monthlybins[monthStr] + value[_key];
                              }
                            });
                            Object.keys(monthlybins).forEach(function (_key) {
                              qpList.push({ x: _key, y: monthlybins[_key] });
                            });
                          } else {
                            Object.keys(value).forEach(function (_key, _index, _fullArr) {
                              let intKey = parseInt(_key);
                              if (intKey != NaN && field != undefined && field["type"] == "number") {
                                if (intKey < leftTaper) {
                                  var tlkey = "< " + leftTaper;
                                  if (taperLeft == undefined) {
                                    taperLeft = { x: tlkey, y: value[_key] };
                                  } else {
                                    taperLeft.y += value[_key];
                                  }
                                } else if (intKey >= rightTaper + binSize) {
                                  var trkey = ">= " + (rightTaper + binSize);
                                  if (taperRight == undefined) {
                                    taperRight = { x: trkey, y: value[_key] };
                                  } else {
                                    taperRight.y += value[_key];
                                  }
                                } else {
                                  // number range tag
                                  let xTag = "";
                                  let leftVal = _key;
                                  // add rightVal if exists
                                  if (_index + 1 < _fullArr.length) {
                                    let rightVal = _fullArr[_index + 1];
                                    xTag = leftVal + " - " + rightVal;
                                  } else {
                                    xTag = leftVal;
                                  }

                                  qpList.push({ x: xTag, y: value[_key] });
                                }
                              } else {
                                qpList.push({ x: _key, y: value[_key] });
                              }
                            });

                            if (taperLeft != undefined) {
                              // prepend left taper
                              qpList.unshift(taperLeft);
                            }

                            if (taperRight != undefined) {
                              // append right taper
                              qpList.push(taperRight);
                            }
                          }

                          // move 'missing' object to end of list
                          var missingObject = qpList.filter((obj) => {
                            console.log(obj);
                            return obj.x === "missing";
                          });
                          if (missingObject != undefined && missingObject.length > 0) {
                            // fancy one liner to splice the object out and re-append it
                            qpList.push(qpList.splice(qpList.indexOf(missingObject[0]), 1)[0]);
                          }

                          if (type == "number") {
                            // return histogram
                            return (
                              <Col key={key} md={12} lg={6} xl={4} style={{ height: "100%" }}>
                                <BentoBarChart
                                  title={title}
                                  data={qpList}
                                  units={units}
                                  height={CHART_HEIGHT}
                                />
                              </Col>
                            );
                          } else {
                            if (chart == "bar") {
                              // return histogram
                              return (
                                <Col key={key} md={12} lg={6} xl={4} style={{ height: "100%" }}>
                                  <BentoBarChart title={title} data={qpList} height={CHART_HEIGHT} />
                                </Col>
                              );
                            } else {
                              // default

                              // return pie chart
                              return (
                                <Col key={key} sm={12} md={6} lg={4} xl={4} style={{ height: "100%" }}>
                                  <BentoPie title={title} data={qpList} height={CHART_HEIGHT} />
                                </Col>
                              );
                            }
                          }
                        }
                      })
                  }
                </Row>
              )
            }
            <Divider />
          </Container>
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