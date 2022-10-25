import React from "react";
import { Collapse } from "antd";
import ExampleQueriesPanel from "./ExampleQueriesPanel"
import ResponsePanel from "./ResponsePanel"

const BottomPanels = ({setQueryValues, beaconResponse}) => {
    const {Panel} = Collapse

    const wrapperStyle = {
        marginTop: "100px"
    }

    return   (
        <div style={wrapperStyle}>
    <Collapse >
    <Panel header="Example Queries" key="2">
      <ExampleQueriesPanel setQueryValues={setQueryValues}/>
    </Panel>
    <Panel header="Response JSON" key="3" >
      <ResponsePanel beaconResponse={beaconResponse}/>
    </Panel>
  </Collapse>
  </div>
  )



}


export default BottomPanels;