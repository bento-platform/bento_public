// reducer.js
const INITIAL_STATE = {
	phenopackets: [],
	overview: {}
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
		case "SET_DATA":
			return {
				...state,
				phenopackets : action.content.phenopackets
			};
		case "SET_OVERVIEW":
			return {
				...state,
				overview : action.content.overview
			};
		default:
			return state;
	}
};