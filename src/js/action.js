// action.js
import axios from "axios"

const setData = (content) => {
	return {
		type: "SET_DATA",
		content
	}
}

// dispatching data to be appended to the
// current state
const appendData = (obj) => {
	return (dispatch) => {
		dispatch(setData(obj));
	}
}

// facilitate retrieving phenopackets data from server
const makeGetRequest = (url) => async (dispatch, getState) => {
    try {
        // simulate network lag
        await sleep(1000)
        
        // fetch data
        const response = await axios.get(url);
        // TODO: validate response
        console.log(response.data);

        // append data from the network
        var state = getState()
        dispatch(setData({"client" : state.client, "phenopackets": Array.concat(state.phenopackets, response.data)}));
    } catch (err){
        console.log(err);
    }
}

// TODO: compartmentalize int to a 'utils.js' file of some sort
// utility functions --

// - delay function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// --

export {
	appendData,
    makeGetRequest
}