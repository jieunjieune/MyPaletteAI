import { POST_SAVEPALETTE } from "../modules/SaveModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const savePaletteApi = (paletteId) => {
	let requestURL = `${prefix}/save/${paletteId}`;

	console.log("팔레트아이디 잘 가져옴?", paletteId);

	return async (dispatch) => {
		try {
			const response = await fetch(requestURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// JWT 토큰 필요하면 추가
				"Authorization": `Bearer ${localStorage.getItem("accessToken") || ""}`,
			},
			});

			if (!response.ok) throw new Error("서버 요청 실패");

			const result = await response.json();
			console.log("결과: ", result);

			dispatch({ type: POST_SAVEPALETTE, payload: result });
		} catch (error) {
			console.error("팔레트 저장 실패:", error);
		}
	};
};