// action.js
import React from "react";
import axios from "axios"

import { sleep } from "./utils.js"
import { katsuUrl } from "./constants"

import QueryParameter from './components/QueryParameter'

const setContent = (type, content) => {
	return {
		type,
		content
	}
}

// retrieve queryable fields
const makeGetQueryableFieldsRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": true
        }));
        
        // await sleep(1000)

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


        // accumulate fields in a single array
        var queryableFields = response.data
        var qpList = [];
        var keys = [];
        Object.keys(queryableFields).forEach(function(key) {
            if (key == "extra_properties") {
                Object.keys(queryableFields[key]).forEach(function(extra_property_key) {
                    queryableFields[key][extra_property_key]["key"] = extra_property_key
                    queryableFields[key][extra_property_key]["is_extra_property_key"] = true

                    keys.push(queryableFields[key][extra_property_key]);
                });
            } else {
                queryableFields[key]["key"] = key
                queryableFields[key]["is_extra_property_key"] = false

                keys.push(queryableFields[key]);
            }
        });

        qpList = keys.map((item) => <QueryParameter key={item.key} Item={item} />); 
        dispatch(setContent("SET_QUERY_PARAMETER_STACK", {
            "items": qpList
        }));
    } catch (err){
        console.log(err);

        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": false
        }));
    }
}

// facilitate retrieving katsu overview data from server
const makeGetOverviewRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": true
        }));
        // simulate network lag
        // await sleep(1000)
        
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

        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": false
        }));
    }
}

const makeGetKatsuPublic = () => async (dispatch, getState) => {
    try {
        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": true
        }));
        // simulate network lag
        // await sleep(1000)
        

        var qpsWithValue = []
        var checkedParametersStack = getState().queryParameterCheckedStack
        checkedParametersStack.forEach(function(item, index){
            console.log(item)
            console.log(index)

            qpsWithValue.push({
                key: item.key,
                type: item.type,
                is_extra_property_key: item.is_extra_property_key,
                value: item.value,
                rangeMin: item.rangeMin,
                rangeMax: item.rangeMax
            })
        })
        console.log(qpsWithValue)

        // POST query parameters
        // TODO: validate response
        const response = await axios.post(katsuUrl, qpsWithValue)
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

        console.log(response)
        // append data from the network
        dispatch(setContent("SET_OVERVIEW", {
            "overview": response.data
        }));
        
        // TODO: format query and fetch from Katsu
    } catch (err){
        console.log(err);
    }

    dispatch(setContent("SET_FETCHING_DATA", {
        "fetch": false
    }));
}

const addQueryParameterToCheckedStack = (item, value, min, max) => async (dispatch, getState) => {
    try {
        var state = getState()
        console.log(item)
        console.log(value)
        // if (state.queryParameterCheckedStack.indexOf(item) < 0) {
            // append data from the network
            dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                "queryParameter": {
                    key: item.key,
                    type: item.type,
                    term: item.term,
                    is_extra_property_key: item.is_extra_property_key,
                    value: value,
                    rangeMin: min,
                    rangeMax: max
                }
            }));
        // }
    } catch (err){
        console.log(err);
    }
}

const updateQueryParameterValueInCheckedStack = (item, itemValue, min, max) => async (dispatch, getState) => {
    try {
        var state = getState()
   
        var foundItem = state.queryParameterCheckedStack.find((param)=>param.term === item.term)
        if (foundItem != undefined) {
            var index = state.queryParameterCheckedStack.indexOf(foundItem)

            await dispatch(setContent("REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK", {
                "index": index
            }));

            if (item.type == "range") {
                console.log("Mocking update range")

                dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                    "queryParameter": {
                        key: item.key,
                        type: item.type,
                        term: item.term,
                        is_extra_property_key: item.is_extra_property_key,
                        rangeMin: min,
                        rangeMax: max
                    }
                }));
            } else {
                dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                    "queryParameter": {
                        key: item.key,
                        type: item.type,
                        term: item.term,
                        is_extra_property_key: item.is_extra_property_key,
                        value: itemValue
                    }
                }));
            }
        }
    } catch (err){
        console.log(err);

        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": false
        }));
    }
}

const removeQueryParameterFromCheckedStack = (item) => async (dispatch, getState) => {
    try {
        var state = getState()
        
        var foundItem = state.queryParameterCheckedStack.find((param)=>param.term === item.term)
        if (foundItem != undefined) {
            var index = state.queryParameterCheckedStack.indexOf(foundItem)
            // if (state.queryParameterCheckedStack.indexOf(item) >= 0) {
                // append data from the network
                dispatch(setContent("REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK", {
                    "index": index
                }));
            // }
        }
    } catch (err){
        console.log(err);

        dispatch(setContent("SET_FETCHING_DATA", {
            "fetch": false
        }));
    }
}


export {
    makeGetQueryableFieldsRequest,
    makeGetOverviewRequest,
    makeGetKatsuPublic,

    addQueryParameterToCheckedStack,
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack
}