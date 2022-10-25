import React from "react";
// import JsonView from "../explorer/JsonView"

const ResponsePanel = ({beaconResponse}) => {

    // return <JsonView inputJson={beaconResponse} />
    return <p>{JSON.stringify(beaconResponse)}</p>
}


export default ResponsePanel