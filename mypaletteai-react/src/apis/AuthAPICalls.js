import { SET_USER_INFO, POST_LOGOUT, POST_RESET_REQUEST, POST_RESET_CONFIRM } from "../modules/AuthModule";

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

// 로그인
export const loginApi = (loginData) => {
    const requestURL = `${prefix}/auth/login`;

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include" // ✅ HttpOnly refreshToken 쿠키 포함
            });

            if (!response.ok) throw new Error("로그인 실패");

            const result = await response.json();
			console.log("로그인 결과: ", result);

            // accessToken + 유저 정보만 저장
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("nickname", result.nickname);

            dispatch({ type: "auth/POST_LOGIN", payload: result });
			console.log("로그인결과: " , result);

            return result;
        } catch (err) {
            console.error("로그인 실패:", err);
            throw err;
        }
    };
};

// 리프레시
export const refreshApi = () => {
	const requestURL = `${prefix}/auth/refresh`;

	return async (dispatch) => {
		try {
		// 🔹 JS에서는 refreshToken 쿠키 접근 불가
		// 브라우저가 자동으로 쿠키를 전송함
		const response = await fetch(requestURL, {
			method: "POST",
			credentials: "include", // 🔹 쿠키 포함
		});

		if (!response.ok) throw new Error("리프레시 토큰 유효하지 않음");

		const data = await response.json();
		console.log("🔄 새 accessToken 발급:", data);

		// 🔹 localStorage 갱신
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("userId", data.userId);
		localStorage.setItem("nickname", data.nickname);

		// 🔹 Redux 상태 갱신
		dispatch({
			type: "auth/SET_USER_INFO",
			payload: {
			userId: data.userId,
			accessToken: data.accessToken,
			nickname: data.nickname,
			},
		});

		return data.accessToken;
		} catch (error) {
		console.error("리프레시 토큰 실패:", error);
		dispatch({ type: POST_LOGOUT });
		localStorage.clear();
		return null;
		}
	};
};

// 로그아웃
export const logoutApi = () => {
	const requestURL = `${prefix}/auth/logout`;

	return async (dispatch) => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) throw new Error("로그인 상태가 아님");

			const response = await fetch(requestURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				credentials: "include", // ✅ refreshToken 쿠키 삭제 위해
			});

			if (!response.ok) throw new Error("로그아웃 실패");

			localStorage.clear();
			dispatch({ type: POST_LOGOUT });
			alert("로그아웃 완료!");
		} catch (err) {
			console.error(err);
			alert("로그아웃 실패! 다시 시도해주세요.");
		}
	};
};

// 비밀번호 재설정 요청 (이메일 발송)
export const resetPasswordRequestApi = (email) => {
    const requestURL = `${prefix}/auth/reset-password-request`;

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const resultText = await response.text();

            if (!response.ok) throw new Error(resultText);

            dispatch({
                type: POST_RESET_REQUEST,
                payload: { message: resultText },
            });

            alert(resultText); // UX용 알림
        } catch (err) {
            console.error("비밀번호 재설정 요청 실패:", err);
            dispatch({
                type: POST_RESET_REQUEST,
                payload: { error: err.message || "요청 실패" },
            });
            alert(err.message || "비밀번호 재설정 요청 실패");
        }
    };
};

// 비밀번호 재설정 완료 (새 비밀번호 설정)
export const resetPasswordConfirmApi = ({ email, resetToken, newPassword }) => {
    const requestURL = `${prefix}/auth/reset-password-confirm`;

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, resetToken, newPassword }),
            });

            const resultText = await response.text();

            if (!response.ok) throw new Error(resultText);

            dispatch({
                type: POST_RESET_CONFIRM,
                payload: { message: resultText },
            });

            alert(resultText); // UX용 알림
        } catch (err) {
            console.error("비밀번호 재설정 실패:", err);
            dispatch({
                type: POST_RESET_CONFIRM,
                payload: { error: err.message || "재설정 실패" },
            });
            alert(err.message || "비밀번호 재설정 실패");
        }
    };
};

// 닉네임 중복체크
export const checkNicknameApi = (nickname) => {
	const requestURL = `${prefix}/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`;
	console.log("요청 url: ", requestURL);

	return async () => {
		try {
			const response = await fetch(requestURL);
			if (!response.ok) {
				throw new Error(await response.text());
			}
			const data = await response.json(); // { available: true, message: "사용 가능한 닉네임입니다." }
			return data;
		} catch (err) {
			console.error("닉네임 중복 확인 오류:", err);
			return { available: false, message: "닉네임 중복 확인 실패" };
		}
	};
};