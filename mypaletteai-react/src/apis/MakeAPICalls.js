import { POST_MAKE } from "../modules/MakeModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const callMakeApi = (inputData) => {

	const requestURL = `${prefix}/make/palette`;

	return async (dispatch) => {
		console.log("요청 URL:", requestURL);
		console.log("보낼 데이터:", inputData);

		try {
		const response = await fetch(requestURL, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(inputData),
		});

		if (!response.ok) throw new Error("서버 요청 실패");

		const result = await response.json();
		console.log("결과:", result);

		dispatch({ type: POST_MAKE, payload: result }); // payload는 서버에서 받은 전체 객체
		} catch (error) {
		console.error("팔레트 생성 실패:", error);
		}
	};
};