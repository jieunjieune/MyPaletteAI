import { createActions, handleActions } from "redux-actions";

const initialState = {
	isLoggedIn: !!localStorage.getItem("accessToken"),
	userId: localStorage.getItem("userId") || null,
	accessToken: localStorage.getItem("accessToken") || null,
	nickname: localStorage.getItem("nickname") || null,
	resetRequestMessage: "",   // 비밀번호 초기화 요청 메시지
	resetConfirmMessage: "",   // 비밀번호 재설정 완료 메시지
	loadingResetRequest: false,
	loadingResetConfirm: false,
	errorResetRequest: null,
	errorResetConfirm: null,
};

export const POST_SIGNUP = "auth/POST_SIGNUP";
export const POST_LOGIN = "auth/POST_LOGIN";
export const POST_LOGOUT = "auth/POST_LOGOUT";
export const SET_USER_INFO = "auth/SET_USER_INFO";
export const POST_RESET_REQUEST = "auth/POST_RESET_REQUEST";
export const POST_RESET_CONFIRM = "auth/POST_RESET_CONFIRM";

export const actions = createActions({
	[POST_SIGNUP]: (payload) => payload,
	[POST_LOGIN]: (payload) => payload,
	[POST_LOGOUT]: () => null,
	[SET_USER_INFO]: (payload) => payload,
	[POST_RESET_REQUEST]: (payload) => payload,
	[POST_RESET_CONFIRM]: (payload) => payload,
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
		[POST_RESET_REQUEST]: (state, { payload }) => ({
			...state,
			loadingResetRequest: false,
			resetRequestMessage: payload?.message || "비밀번호 재설정 요청 완료",
			errorResetRequest: payload?.error || null,
		}),
		[POST_RESET_CONFIRM]: (state, { payload }) => ({
			...state,
			loadingResetConfirm: false,
			resetConfirmMessage: payload?.message || "비밀번호가 성공적으로 변경되었습니다.",
			errorResetConfirm: payload?.error || null,
		}),
	},
	initialState
);

export default authReducer;