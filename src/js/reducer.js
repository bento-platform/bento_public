// reducer.js
import { debuglog } from "./utils"

const INITIAL_STATE = {
	config: {},
	isFetchingConfig: false,
	overview: {},
	isFetchingOverview: false,
	isFetchingFields: false,
	queryParameterStack: [],
	queryParameterCheckedStack: [],
	queryResponseData: {},
	isFetchingData: false,
	activeTab: ""
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
		case "SET_FETCHING_DATA":
			return {
				...state,
				isFetchingData : action.content.fetch
			};
		case "SET_FETCHING_CONFIG":
			return {
				...state,
				isFetchingConfig : action.content.fetch
			};
		case "SET_FETCHING_OVERVIEW":
			return {
				...state,
				isFetchingOverview : action.content.fetch
			};
		case "SET_FETCHING_FIELDS":
			return {
				...state,
				isFetchingFields : action.content.fetch
			};
		
		case "SET_CONFIG":
			return {
				...state,
				config : action.content.config,
				isFetchingConfig : false
			};
		case "SET_OVERVIEW":
			return {
				...state,
				overview : action.content.overview,
				isFetchingOverview : false
			};
		case "SET_QUERY_RESPONSE_DATA":
			return {
				...state,
				queryResponseData : action.content.queryResponseData,
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
				isFetchingFields : false
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

		case "SET_ACTIVE_TAB":
			console.log({action: action})
			return {
				...state,
				activeTab : action.content.activeTab
			};
		default:
			return state;
	}
};