// action.js
import axios from "axios"

const setData = (content) => {
	return {
		type: "SET_DATA",
		content
	}
}

const appendData = (obj) => {
	return (dispatch) => {
		dispatch(setData(obj));
	}
}

const makeGetRequest = (url) => async (dispatch, getState) => {
        try {
            await sleep(1000)
        const response = await axios.get(url);
            console.log(response.data);
            // TODO: validate response
            var state = getState()

            // append data from the network
            dispatch(setData({"name" : state.name, "books": Array.concat(state.books, response.data)}));
        } catch (err){
            console.log(err);
        }
	}

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


export {
	appendData,
    makeGetRequest
}