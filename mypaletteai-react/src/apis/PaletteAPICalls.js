import { GET_PALETTES, GET_PALETTE } from "../modules/PaletteModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const callPaletteApi = () => {
	let requestURL = `${prefix}/palettes`;

	return async (dispatch) => {

		const response = await fetch(requestURL);
		const text = await response.text();
		// console.log("백엔드 원본 응답:", text);
		const result = JSON.parse(text); // 문제 없으면 여기서 파싱

		try{
			const response = await fetch(requestURL);

		if (!response.ok) throw new Error("서버 요청 실패");

		const result = await response.json();
		// console.log("결과: ", result);

		dispatch({ type: GET_PALETTES, payload: result });
		} catch (error) {
		console.error("팔레트 조회 실패:", error);
		}
	};
};

export const paletteDetailApi = (paletteId) => {
	let requestURL = `${prefix}/palettes/${paletteId}`;

	return async (dispatch) => {

		const response = await fetch(requestURL);
		const text = await response.text();
		const result = JSON.parse(text);

		try{
			const response = await fetch(requestURL);

		if (!response.ok) throw new Error("서버 요청 실패");

		const result = await response.json();
		console.log("결과: ", result);

		dispatch({ type: GET_PALETTE, payload: result });
		} catch (error) {
		console.error("팔레트 조회 실패:", error);
		}
	};
};