import { DELETE_SAVEPALETTE, GET_SAVEPALETTES, POST_SAVEPALETTE } from "../modules/SaveModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const savePaletteApi = (paletteId) => {
	const requestURL = `${prefix}/save/${paletteId}`;

	return async (dispatch) => {
		try {
			const token = localStorage.getItem("accessToken");
			const response = await fetch(requestURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("서버 요청 실패");

			const result = await response.json();
			dispatch({ type: POST_SAVEPALETTE, payload: result });

			// ✅ 여기서 반환
			return result;
		} catch (error) {
			console.error("팔레트 저장 실패:", error);
			throw error; // 에러를 그대로 던져서 호출한 쪽에서 처리 가능
		}
	};
};

export const getSavePalettesApi = () => {
	const requestURL = `${prefix}/save`;

	return async (dispatch) => {
	console.log("요청 url: ", requestURL);

	try {
		const token = localStorage.getItem("accessToken"); // ✅ 토큰 가져오기

		const response = await fetch(requestURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`, // ✅ 인증 토큰 추가
		},
		});

		if (!response.ok) throw new Error("서버 요청 실패");

		const result = await response.json();
		console.log("api 결과: ", result);

		dispatch({ type: GET_SAVEPALETTES, payload: result });
	} catch (error) {
		console.error("팔레트 조회 실패:", error);
	}
	};
};

export const deleteSavePaletteApi = (saveId) => {
	const requestURL = `${prefix}/save/${saveId}`;

	return async (dispatch) => {
		console.log("요청 url: ", requestURL);

		try {
			const token = localStorage.getItem("accessToken");

			const response = await fetch(requestURL, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("서버 요청 실패");

			// DELETE는 일반적으로 본문이 없으므로 JSON 파싱 생략
			dispatch({ type: DELETE_SAVEPALETTE, payload: saveId });
			return saveId; // ✅ 필요하면 호출한 쪽에서 사용 가능
		} catch (error) {
			console.error("팔레트 삭제 실패:", error);
			return null; // 실패 시 null 반환
		}
	};
};