import { createActions, handleActions } from "redux-actions";

// 초기 상태를 객체로 변경
const initialState = {
  list: [],      // 전체 팔레트 리스트
  detail: null,  // 선택한 팔레트 상세
  message: null, // 삭제나 기타 메시지
};

export const GET_PALETTES = "palettes/GET_PALETTES";
export const GET_PALETTE = "palettes/GET_PALETTE";
export const POST_PALETTE = "palettes/POST_PALETTE";
export const PUT_PALETTE = "palettes/PUT_PALETTE";
export const DELETE_PALETTE = "palettes/DELETE_PALETTE";

export const actions = createActions({
	[GET_PALETTES]: (payload) => payload,
	[GET_PALETTE]: (payload) => payload,
	[POST_PALETTE]: (payload) => payload,
	[PUT_PALETTE]: (payload) => payload,
	[DELETE_PALETTE]: (payload) => payload,
	});

	const paletteReducer = handleActions(
	{
		// 전체 팔레트 조회
		[GET_PALETTES]: (state, { payload }) => ({
		...state,
		list: payload,
		}),
		// 특정 팔레트 조회
		[GET_PALETTE]: (state, { payload }) => ({
		...state,
		detail: payload,
		}),
		// 새 팔레트 생성
		[POST_PALETTE]: (state, { payload }) => ({
		...state,
		list: [...state.list, payload],
		detail: payload,
		}),
		// 팔레트 수정
		[PUT_PALETTE]: (state, { payload }) => ({
		...state,
		list: state.list.map((p) =>
			p.paletteId === payload.paletteId ? payload : p
		),
		detail: payload,
		}),
		// 팔레트 삭제
		[DELETE_PALETTE]: (state, { payload }) => ({
		...state,
		list: state.list.filter((p) => p.paletteId !== payload.paletteId),
		message: payload.message,
		detail:
			state.detail?.paletteId === payload.paletteId ? null : state.detail,
		}),
	},
	initialState
);

export default paletteReducer;