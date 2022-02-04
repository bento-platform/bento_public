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
    makeGetOverviewRequest
}