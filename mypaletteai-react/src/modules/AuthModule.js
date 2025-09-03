import { createActions, handleActions } from "redux-actions";

const initialState = {
	isLoggedIn: !!localStorage.getItem("accessToken"),
	userId: localStorage.getItem("userId") || null,
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
			nickname: payload.nickname || state.nickname,
		}),
		[POST_LOGIN]: (state, { payload }) => {
			if (payload.nickname) {
				localStorage.setItem("nickname", payload.nickname);
				localStorage.setItem("userId", payload.userId);
			}
			if (payload.accessToken) localStorage.setItem("accessToken", payload.accessToken);

			return {
				...state,
				isLoggedIn: true,
				userId: payload.userId,
				accessToken: payload.accessToken,
				nickname: payload.nickname || state.nickname,
			};
		},
		[SET_USER_INFO]: (state, { payload }) => {
			if (payload.accessToken) localStorage.setItem("accessToken", payload.accessToken);
			if (payload.userId) localStorage.setItem("userId", payload.userId);
			if (payload.nickname) localStorage.setItem("nickname", payload.nickname);

			return {
				...state,
				isLoggedIn: !!payload.accessToken,
				userId: payload.userId || state.userId,
				accessToken: payload.accessToken || state.accessToken,
				nickname: payload.nickname || state.nickname,
			};
		},
		[POST_LOGOUT]: () => {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("nickname");
			localStorage.removeItem("userId");

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