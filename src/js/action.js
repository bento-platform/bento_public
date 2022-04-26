// action.js
import React from "react";
import axios from "axios"

import { debuglog } from "./utils.js"
import { katsuUrl } from "./constants"

import QueryParameter from './components/QueryParameter'

const setContent = (type, content) => {
	return {
		type,
		content
	}
}

// facilitate retrieving katsu public-overview data from server
const makeGetConfigRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_CONFIG", {
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

                dispatch(setContent("SET_FETCHING_CONFIG", {
                    "fetch": false
                }));
            });

        // append data from the network
        dispatch(setContent("SET_CONFIG", {
            "config": response.data
        }));
    } catch (err){
        console.log(err);

        dispatch(setContent("SET_FETCHING_CONFIG", {
            "fetch": false
        }));
    }
}

const makeGetOverviewRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_OVERVIEW", {
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

                dispatch(setContent("SET_FETCHING_OVERVIEW", {
                    "fetch": false
                }));
            });

        // append data from the network
        dispatch(setContent("SET_OVERVIEW", {
            "overview": response.data
        }));
    } catch (err){
        console.log(err);

        dispatch(setContent("SET_FETCHING_OVERVIEW", {
            "fetch": false
        }));
    }
}

// retrieve queryable fields
const makeGetQueryableFieldsRequest = (url) => async (dispatch) => {
    try {
        dispatch(setContent("SET_FETCHING_FIELDS", {
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

                dispatch(setContent("SET_FETCHING_FIELDS", {
                    "fetch": false
                }));
            });


        // accumulate fields in a single array
        var queryableFields = response.data
        var qpList = [];
        var keys = [];
        Object.keys(queryableFields).forEach(function(key) {
            if (key == "extra_properties") {
                // obtain key-value pairs from the second level of nested objects
                Object.keys(queryableFields[key]).forEach(function(extra_property_key) {
                    queryableFields[key][extra_property_key]["key"] = extra_property_key
                    queryableFields[key][extra_property_key]["is_extra_property_key"] = true

                    keys.push(queryableFields[key][extra_property_key]);
                });
            } else {
                // obtain key-value pairs from the first level of nested objects
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

        dispatch(setContent("SET_FETCHING_FIELDS", {
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
            debuglog(item)
            debuglog(index)

            qpsWithValue.push({
                key: item.key,
                type: item.type,
                is_extra_property_key: item.is_extra_property_key,
                value: item.value,
                rangeMin: item.rangeMin,
                rangeMax: item.rangeMax,
                dateAfter: item.dateAfter,
                dateBefore: item.dateBefore
            })
        })
        debuglog(qpsWithValue)

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
        dispatch(setContent("SET_QUERY_RESPONSE_DATA", {
            "queryResponseData": response.data
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
        // var state = getState()
        debuglog(item)
        debuglog(value)
        // if (state.queryParameterCheckedStack.indexOf(item) < 0) {
            // append data from the network
            dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                "queryParameter": {
                    key: item.key,
                    type: item.type,
                    title: item.title,
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

const updateQueryParameterValueInCheckedStack = (item, itemValue, min, max, dateAfter, dateBefore) => async (dispatch, getState) => {
    try {
        var state = getState()
   
        var foundItem = state.queryParameterCheckedStack.find((param)=>param.title === item.title)
        if (foundItem != undefined) {
            var index = state.queryParameterCheckedStack.indexOf(foundItem)

            await dispatch(setContent("REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK", {
                "index": index
            }));

            if (item.type == "number") {
                dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                    "queryParameter": {
                        key: item.key,
                        type: item.type,
                        title: item.title,
                        is_extra_property_key: item.is_extra_property_key,
                        rangeMin: min,
                        rangeMax: max
                    }
                }));
            } else if (item.type == "string" && 
                        item.format != undefined && 
                        item.format == "date") {
                dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                    "queryParameter": {
                        key: item.key,
                        type: item.type,
                        title: item.title,
                        is_extra_property_key: item.is_extra_property_key,
                        dateAfter: dateAfter,
                        dateBefore: dateBefore
                    }
                }));
            } else {
                dispatch(setContent("ADD_QUERY_PARAMETER_TO_CHECKED_STACK", {
                    "queryParameter": {
                        key: item.key,
                        type: item.type,
                        title: item.title,
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
        
        var foundItem = state.queryParameterCheckedStack.find((param)=>param.title === item.title)
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
    makeGetConfigRequest,
    makeGetQueryableFieldsRequest,
    makeGetOverviewRequest,
    makeGetKatsuPublic,
    addQueryParameterToCheckedStack,
    updateQueryParameterValueInCheckedStack,
    removeQueryParameterFromCheckedStack,
}