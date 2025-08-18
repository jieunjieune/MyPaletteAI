import { createActions, handleActions } from "redux-actions";

const initialState = {};

export const POST_SIGNUP = "auth/POST_SIGNUP";
export const POST_LOGIN = 'auth/POST_LOGIN';
export const POST_LOGOUT = 'auth/POST_LOGOUT';

const actions = createActions({
	[POST_SIGNUP]: () =>{},
	[POST_LOGIN]: () => {},
	[POST_LOGOUT]: () => {}
})

const authReducer = handleActions(
	{
		[POST_SIGNUP]: (state, { payload }) =>{
			return payload;
		},
		[POST_LOGIN]: (state, { payload }) =>{
			return payload;
		},
		[POST_LOGOUT]: (state, { payload }) =>{
			return payload;
		}
	},
	initialState
);

export default authReducer;