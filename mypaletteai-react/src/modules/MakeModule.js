import { createActions, handleActions } from "redux-actions";

const initialState = {};

export const POST_MAKE = "make/POST_MAKE";

const actions  = createActions({
	[POST_MAKE]: () => {}
})

const makeReducer = handleActions(
	{
		[POST_MAKE]: (state, { payload }) => payload
	},
	initialState
);

export default makeReducer;