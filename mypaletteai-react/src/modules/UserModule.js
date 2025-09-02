import { createActions, handleActions } from "redux-actions";

const initialState = {
	user: null,
	GET_USER_ALL: []
};

export const GET_USER_ALL = 'user/GET_USER_ALL';
export const GET_USER_ONE = 'user/GET_USER_ONE';
export const PUT_USER = 'user/PUT_USER';
export const DELETE_USER = 'user/DELETE_USER';

const actions = createActions({
	[GET_USER_ALL]: () => {},
	[GET_USER_ONE]: () => {},
	[PUT_USER]: () => {},
	[DELETE_USER]: () => {},
})

const userReducer = handleActions(
	{
		[GET_USER_ALL]: (state, { payload }) => {
			return {
				...state,
				GET_USER_ALL: payload
			};
		},
		[GET_USER_ONE]: (state, { payload }) => {
			return payload;
		},
		[PUT_USER]: (state, { payload }) => {
			return payload;
		},
		[DELETE_USER]: (state, { payload }) => {
			return payload;
		},
	},
	initialState
);

export default userReducer;