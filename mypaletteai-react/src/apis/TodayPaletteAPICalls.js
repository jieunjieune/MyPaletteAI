import { GET_TODAY_PALETTE } from "../modules/TodayPaletteModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const callTodayPaletteApi = () => {
	let requestURL = `${prefix}/today`;

	return async (dispatch) => {
		console.log("요청 url: ", requestURL);
		try {
		const response = await fetch(requestURL);

		if (!response.ok) throw new Error("서버 요청 실패");

		const result = await response.json();
		console.log("결과: ", result);

		dispatch({ type: GET_TODAY_PALETTE, payload: result });
		} catch (error) {
		console.error("팔레트 조회 실패:", error);
		}
	};
};