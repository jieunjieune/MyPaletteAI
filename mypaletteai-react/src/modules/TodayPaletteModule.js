import { createActions, handleActions } from "redux-actions";

// 초기 설정
const initialState = {
	title: "",
	mood: "",
	recommendedColors: []
};

export const GET_TODAY_PALETTE = "today/GET_TODAY_PALETTE";

const actions = createActions({
	[GET_TODAY_PALETTE]: () => {}
})

const todayPaletteReducer = handleActions(
	{
		[GET_TODAY_PALETTE]: (state, { payload }) => ({
			...state,
			...payload
		})
	},
	initialState
);

export default todayPaletteReducer;