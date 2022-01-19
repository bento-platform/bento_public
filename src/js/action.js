// action.js
import axios from "axios"

import { sleep } from "./utils.js"

const setContent = (type, content) => {
	return {
		type,
		content
	}
}

// facilitate retrieving phenopackets data from server
const makeGetRequest = (url) => async (dispatch, getState) => {
    try {
        // simulate network lag
        await sleep(1500)
        
        // fetch data
        const response = await axios.get(url);
        // TODO: validate response
        // console.log(response.data);

        // append data from the network
        var state = getState()
        dispatch(setContent("SET_DATA", {
            "phenopackets": Array.concat(state.phenopackets, response.data)
        }));
    } catch (err){
        console.log(err);
    }
}

// facilitate retrieving katsu overview data from server
const makeGetOverviewRequest = (url) => async (dispatch) => {
    try {
        // simulate network lag
        await sleep(1000)
        
        // fetch data
        const response = await axios.get(url);
        // TODO: validate response
        // console.log(response.data);

        // append data from the network
        dispatch(setContent("SET_OVERVIEW", {
            "overview": response.data
        }));
    } catch (err){
        console.log(err);
    }
}

export {
    makeGetRequest,
    makeGetOverviewRequest
}