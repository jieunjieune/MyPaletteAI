import { createActions, handleActions } from "redux-actions";

const initialState = {
	isLoggedIn: !!localStorage.getItem("accessToken"),
	userId: null,
	accessToken: localStorage.getItem("accessToken") || null,
	nickname: localStorage.getItem("nickname") || null,
};

export const POST_SIGNUP = "auth/POST_SIGNUP";
export const POST_LOGIN = "auth/POST_LOGIN";
export const POST_LOGOUT = "auth/POST_LOGOUT";
export const SET_USER_INFO = "auth/SET_USER_INFO";

export const actions = createActions({
	[POST_SIGNUP]: (payload) => payload,
	[POST_LOGIN]: (payload) => payload,
	[POST_LOGOUT]: () => null,
	[SET_USER_INFO]: (payload) => payload,
});

const authReducer = handleActions(
	{
		[POST_SIGNUP]: (state, { payload }) => ({
			...state,
			isLoggedIn: true,
			userId: payload.userId,
			accessToken: payload.accessToken,
		}),
		[POST_LOGIN]: (state, { payload }) => {
			if (payload.nickname) {
				localStorage.setItem("nickname", payload.nickname);
			}
			return {
				...state,
				isLoggedIn: true,
				userId: payload.userId,
				nickname: payload.nickname || state.nickname,
				accessToken: payload.accessToken,
			};
		},
		[SET_USER_INFO]: (state, { payload }) => ({
			...state,
			userId: payload.userId,
			nickname: payload.nickname || state.nickname,
			accessToken: payload.accessToken,
			isLoggedIn: true,
		}),
		[POST_LOGOUT]: () => {
			localStorage.removeItem("nickname");
			return {
				...initialState,
				isLoggedIn: false,
				userId: null,
				accessToken: null,
				nickname: null,
			};
		},
	},
	initialState
);

export default authReducer;