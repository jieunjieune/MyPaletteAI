import { createActions, handleActions } from "redux-actions";

const initialState = {
	list: [],
	loading: false,
};

export const GET_SAVEPALETTES = "save/GET_SAVEPALETTES";
export const POST_SAVEPALETTE = "save/POST_SAVEPALETTE";
export const DELETE_SAVEPALETTE = "save/DELETE_SAVEPALETTE";

export const actions = createActions({
	[GET_SAVEPALETTES]: (payload) => payload,
	[POST_SAVEPALETTE]: (payload) => payload,
	[DELETE_SAVEPALETTE]: (payload) => payload,
});

const saveReducer = handleActions(
	{
		[GET_SAVEPALETTES]: (state, { payload }) => ({
			...state,
			list: payload,
		}),
		[POST_SAVEPALETTE]: (state, { payload }) => ({
			...state,
			list: payload, // 새 팔레트 추가
		}),
		[DELETE_SAVEPALETTE]: (state, { payload }) => ({
			...state,
			list: state.list.filter((p) => p.paletteId !== payload), // payload에 삭제할 paletteId 전달
		}),
	},
	initialState
);

export default saveReducer;