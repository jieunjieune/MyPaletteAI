import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POST_LOGOUT, SET_USER_INFO } from "../modules/AuthModule";
import { refreshApi } from "../apis/AuthAPICalls";
import { jwtDecode } from "jwt-decode";

export const useLoginInfo = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, userId, accessToken, nickname } = useSelector(
		(state) => state.authReducer
	);

	useEffect(() => {
		const initializeAuth = async () => {
		const token = localStorage.getItem("accessToken");
		const storedUserId = localStorage.getItem("userId");
		const storedNickname = localStorage.getItem("nickname");
		const rememberMe = localStorage.getItem("rememberMe") === "true";

		if (!token) {
			dispatch({ type: POST_LOGOUT });
			return;
		}

		try {
			const decoded = jwtDecode(token);
			const now = Date.now() / 1000;

			let finalUserId = decoded.sub || storedUserId;
			let finalAccessToken = token;
			let finalNickname = storedNickname;

			// 🔹 accessToken 만료 시 refresh 시도
			if (decoded.exp && decoded.exp < now) {
			const newAccessToken = await dispatch(refreshApi());
			if (!newAccessToken) return; // 로그아웃 처리됨
			finalAccessToken = newAccessToken;
			finalUserId = localStorage.getItem("userId");
			finalNickname = localStorage.getItem("nickname");
			}

			// 🔹 Redux 상태 갱신
			dispatch({
			type: SET_USER_INFO,
			payload: {
				userId: finalUserId,
				accessToken: finalAccessToken,
				nickname: finalNickname,
			},
			});
		} catch (err) {
			console.error("토큰 처리 실패:", err);
			dispatch({ type: POST_LOGOUT });
			localStorage.clear();
		}
		};

		initializeAuth();
	}, [dispatch]);

	return { isLoggedIn, userId, accessToken, nickname };
};

export default useLoginInfo;