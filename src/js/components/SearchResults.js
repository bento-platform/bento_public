import React from "react";
import Spinner from 'react-bootstrap/Spinner'

const SearchResults = ({queryResponseData, isFetchingData}) => {
    const validResponse = queryResponseData != null && Object.keys(queryResponseData).length !== 0
    const wrapperStyle = {padding: "40px", minHeight: "150px", maxHeight: "150px"}
    const textStyle = {fontSize: "30px"}

    // TODO: return styled reponse instead of just text
    const formatResponse = (r) => {
        if (r.hasOwnProperty("message")){
            return r.message
        }
        if (r.hasOwnProperty("count")){
            return `count: ${r.count}`
        }

        // no other cases 
        return ""

    }

    const responseText = validResponse? formatResponse(queryResponseData) : ""

    return (
      <div style={wrapperStyle}>
        <Spinner animation="border" hidden={!isFetchingData} />
        <p style={textStyle}>{responseText}</p>
      </div>
    );
}

export default SearchResults;


