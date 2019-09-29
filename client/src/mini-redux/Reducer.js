import Types from './ActionTypes';

const Reducer = (state, action) => {
	switch (action.type) {
	case Types.SET_NAME:
		return {
			...state,
			name: action.payload
		};
	case Types.SET_FILES:
		return {
			...state,
			files: action.files
		};
	case Types.INIT:
	default:
		return {
			name: '',
			files: []
		};
	}
};

export default Reducer;
