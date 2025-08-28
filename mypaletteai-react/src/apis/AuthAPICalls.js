const prefix = `http://${process.env.REACT_APP_RESTAPI_IP}:8080`;

export const signupApi = (userData) => {
	const requestURL = `${prefix}/auth/signup`;

	return async (dispatch) => {
		console.log("가입 요청 url: ", requestURL);
		try {
			const response = await fetch(requestURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData)
			});
			if (!response.ok) throw new Error("회원가입 실패");

			const result = await response.text();
			console.log("회원가입 결과:", result);
			alert(result);

			dispatch({ type: "user/REGISTER_USER", payload: result });
		} catch (err) {
			console.error("회원가입 실패:", err);
			alert("회원가입 실패! 이메일 중복 또는 서버 오류.");
		}
	};
};