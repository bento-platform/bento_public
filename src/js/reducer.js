// reducer.js
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
			console.log("Reducing SET_QUERY_PARAMETER_STACK")

			console.log("Current stack: " + state.queryParameterStack)		
			var newStack = action.content.items
			console.log("New stack: " + newStack)
			
			return {
				...state,
				queryParameterStack : newStack,
				isFetchingData : false
			};


		case "ADD_QUERY_PARAMETER_TO_CHECKED_STACK":
			console.log("Reducing ADD_QUERY_PARAMETER_TO_CHECKED_STACK")

			console.log("Current stack: " + state.queryParameterCheckedStack)		
			var newStack = state.queryParameterCheckedStack.concat([action.content.queryParameter])
			console.log("New stack: " + newStack)
			
			return {
				...state,
				queryParameterCheckedStack : newStack,
			};
		case "REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK":
			console.log("Reducing REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK")
			
			console.log("Current stack: " + state.queryParameterCheckedStack)		
			var newStack = [...state.queryParameterCheckedStack]
			newStack.splice(action.content.index, 1)
			console.log("New stack: " + newStack)

			return {
				...state,
				queryParameterCheckedStack : newStack,
			};		
		default:
			return state;
	}
};