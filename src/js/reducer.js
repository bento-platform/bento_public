// reducer.js
const INITIAL_STATE = {
	isFetchingData: false,
	overview: {}
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
		default:
			return state;
	}
};