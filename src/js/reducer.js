// reducer.js
import { debuglog } from "./utils"

const INITIAL_STATE = {
	isFetchingData: false,
	overview: {},
	queryableFields: {},
	queryParameterStack: [],
	queryParameterCheckedStack: []
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
		case "SET_FETCHING_DATA":
			return {
				...state,
				isFetchingData : action.content.fetch
			};

		case "SET_OVERVIEW":
			return {
				...state,
				overview : action.content.overview,
				isFetchingData : false
			};
		case "SET_QUERYABLE_FIELDS":
			return {
				...state,
				queryableFields : action.content.queryableFields,
				isFetchingData : false
			};


		case "SET_QUERY_PARAMETER_STACK":
			debuglog("Reducing SET_QUERY_PARAMETER_STACK")

			debuglog("Current stack: " + state.queryParameterStack)		
			var newStack = action.content.items
			debuglog("New stack: " + newStack)
			
			return {
				...state,
				queryParameterStack : newStack,
				isFetchingData : false
			};


		case "ADD_QUERY_PARAMETER_TO_CHECKED_STACK":
			debuglog("Reducing ADD_QUERY_PARAMETER_TO_CHECKED_STACK")

			debuglog("Current stack: " + state.queryParameterCheckedStack)		
			var newStack = state.queryParameterCheckedStack.concat([action.content.queryParameter])
			debuglog("New stack: " + newStack)
			
			return {
				...state,
				queryParameterCheckedStack : newStack,
			};
		case "REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK":
			debuglog("Reducing REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK")
			
			debuglog("Current stack: " + state.queryParameterCheckedStack)		
			var newStack = [...state.queryParameterCheckedStack]
			newStack.splice(action.content.index, 1)
			debuglog("New stack: " + newStack)

			return {
				...state,
				queryParameterCheckedStack : newStack,
			};		
		default:
			return state;
	}
};