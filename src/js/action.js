// action.js
import axios from "axios"

import { sleep } from "./utils.js"

const setContent = (type, content) => {
	return {
		type,
		content
	}
}

// facilitate retrieving katsu overview data from server
const makeGetOverviewRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": true
        }));
        // simulate network lag
        await sleep(1000)
        
        // fetch data
        // TODO: validate response
        const response = await axios.get(url)
            .catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }

                dispatch(setContent("SET_FETCHING_DATA", {
                    "fetch": false
                }));
            });

        // append data from the network
        dispatch(setContent("SET_OVERVIEW", {
            "overview": response.data
        }));
    } catch (err){
        console.log(err);
    }
}

export {
    makeGetOverviewRequest
}