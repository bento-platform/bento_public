// reducer.js
const INITIAL_STATE = {
	overview: {}
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
		case "SET_OVERVIEW":
			return {
				...state,
				overview : action.content.overview
			};
		default:
			return state;
	}
};