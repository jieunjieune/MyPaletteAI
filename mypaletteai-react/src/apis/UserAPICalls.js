import { GET_USER_ALL, GET_USER_ONE } from "../modules/UserModule";

const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const userAllApi = () => {
	const requestURL = `${prefix}/user/all`;
	console.log("api 요청 url: ", requestURL);

	return async (dispatch) => {
		try {
			const response = await fetch(requestURL, {
				method: 'GET'
			});

			const result = await response.json();
			console.log("api 결과: ", result);

			let users = [];

			if (Array.isArray(result)) {
				users = result;
			} else if (Array.isArray(result?.data)) {
				users = result.data;
			} else {
				console.warn("api 응답이 배열 형식이 아니. 빈 대열로 대체합니다.");
			}

			console.log("api 최종 users: ", users);

			dispatch( { type: GET_USER_ALL, payload: users });

		} catch (error) {
			console.error("api 오류 발생: ", error);
			dispatch( { type: GET_USER_ALL, payload: [] });
		}
	};
};

export const userApi = (userId) => {

	const requestURL = `${prefix}/user/${userId}`;
	console.log("api 요청 url: ", requestURL);

	return async (dispatch, getState) => {
		try {
			const response = await fetch(requestURL, {
				method: 'GET'
			});

			if (!response.ok) {
				console.error(`서버 응답 오류: ${response.status}`);
				alert("회원 정보를 찾을 수 없습니다.");
				return;
			}

			const data = await response.json();

			dispatch( { type: GET_USER_ONE, payload: data });

			return data;
		} catch (error) {
			console.error("회원 정보 호출 실패:", error);
			alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
		}
	};
};