import { createActions, handleActions } from "redux-actions";

const initialState = [];

export const GET_PALETTES = "palettes/GET_PALETTES";
export const GET_PALETTE = "palettes/GET_PALETTE";
export const POST_PALETTE = "palettes/POST_PALETTE";
export const PUT_PALETTE = "palettes/PUT_PALETTE";
export const DELETE_PALETTE = "palettes/DELETE_PALETTE";

const actions  = createActions({
	[GET_PALETTES]: () => {},
	[GET_PALETTE]: () => {},
	[POST_PALETTE]: () => {},
	[PUT_PALETTE]: () => {},
	[DELETE_PALETTE]: () => {}
})

const paletteReducer = handleActions(
	{
		[GET_PALETTES]: (state, { payload }) => payload,
		[GET_PALETTE]: (state, { payload }) => ({
			...state,
			detail: payload
		}),
		[POST_PALETTE]: (state, { payload }) => ({
			...state,
			detail: payload   // 새로 등록한 팔레트는 detail에 저장
		}),
		[PUT_PALETTE]: (state, { payload }) => ({
			...state,
			detail: payload   // 수정된 팔레트
		}),
		[DELETE_PALETTE]: (state, { payload }) => ({
			...state,
			message: payload  // 삭제 결과 메시지
		})
		},
		initialState
	);

export default paletteReducer;