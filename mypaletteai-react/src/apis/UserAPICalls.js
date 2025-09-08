import { GET_USER_ALL, GET_USER_ONE, PUT_USER } from "../modules/UserModule";
import { SET_USER_INFO } from "../modules/AuthModule";

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

export const updateUserApi = (userId, userData) => {
	const requestURL = `${prefix}/user/${userId}`;
	const accessToken = localStorage.getItem("accessToken");

	return async (dispatch) => {
	try {
		const response = await fetch(requestURL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(userData),
		});

		const contentType = response.headers.get("content-type");
		let result;
		if (contentType && contentType.includes("application/json")) {
		result = await response.json();
		} else {
		result = await response.text();
		}

		if (!response.ok) {
		throw new Error(result?.message || result || "회원정보 수정 실패");
		}

		alert(result?.message || "회원정보가 수정되었습니다.");

		// Redux 상태 업데이트
		dispatch({
		type: "SET_USER_INFO",
		payload: {
			userId,
			nickname: userData.nickname,
			accessToken,
		},
		});
		localStorage.setItem("nickname", userData.nickname);

		return result;
	} catch (err) {
		console.error("회원정보 수정 오류:", err);
		alert(err.message || "회원정보 수정 실패");
		throw err;
	}
	};
};