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

export const loginApi = (loginData) => {
	const requestURL = `${prefix}/auth/login`;

	return async (dispatch) => {
		console.log("로그인 요청 url: ", requestURL);
		try {
			const response = await fetch(requestURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginData),
				credentials: "include"		// 리프레시 토큰 쿠키 포함!
			});

			if (!response.ok) throw new Error("로그인 실패");

			// 로그인은 보통 JSON 응답 (회원정보 or 토큰)
			const result = await response.json();
			console.log("로그인 결과:", result);

			// 엑세스 토큰 저장
			localStorage.setItem("accessToken", result.accessToken);

			// 스토어 저장
			dispatch({ type: "auth/POST_LOGIN", payload: result });

			console.log("로그인 한 사람? ", result);
			// 로그인 성공 알림
			alert("로그인 성공!");
		} catch (err) {
			console.error("로그인 실패:", err);
			alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
		}
	};
};

export const refreshApi = () => {
	const requestURL = `${prefix}/auth/refresh`;
	
		return async () => {
		try {
			const response = await fetch(requestURL, {
			method: "POST",
			credentials: "include" // ✅ 쿠키 포함
			});
	
			if (!response.ok) throw new Error("토큰 재발급 실패");
	
			const data = await response.json();
			return data.accessToken;
		} catch (err) {
			console.error("토큰 재발급 실패:", err);
			return null;
		}
	};
};