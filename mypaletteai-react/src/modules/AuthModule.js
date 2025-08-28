import { createActions, handleActions } from "redux-actions";

const initialState = {};

export const POST_SIGNUP = "auth/POST_SIGNUP";
export const POST_LOGIN = 'auth/POST_LOGIN';
export const POST_LOGOUT = 'auth/POST_LOGOUT';

export const actions = createActions({
	[POST_SIGNUP]: (payload) => payload,
	[POST_LOGIN]: (payload) => payload,
	[POST_LOGOUT]: () => null
});

const authReducer = handleActions(
	{
		[POST_SIGNUP]: (state, { payload }) =>({
			...state,
			user: payload.user,
			token: payload.token
		}),
		[POST_LOGIN]: (state, { payload }) => ({
			...state,
			user: payload.user,
			token: payload.token
		}),
		[POST_LOGOUT]: () => initialState
	},
	initialState
);

export default authReducer;