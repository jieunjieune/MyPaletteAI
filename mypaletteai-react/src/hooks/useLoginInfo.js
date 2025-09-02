import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POST_LOGOUT, SET_USER_INFO } from "../modules/AuthModule";
import { refreshApi } from "../apis/AuthAPICalls";
import { userApi } from "../apis/UserAPICalls";   // 🔹 유저 상세 조회 API
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

		// 🔹 토큰 없으면 로그아웃
		if (!token) {
			dispatch({ type: POST_LOGOUT });
			return;
		}

		try {
			const decoded = jwtDecode(token);
			const now = Date.now() / 1000;

			let finalUserId = decoded.sub || storedUserId;
			let finalAccessToken = token;
			let finalNickname = null;

			if (decoded.exp && decoded.exp < now) {
			// 🔹 accessToken 만료 → refresh 시도
			const newData = await dispatch(refreshApi()); // {accessToken, userId, nickname} 예상
			if (newData?.accessToken) {
				const newDecoded = jwtDecode(newData.accessToken);
				finalUserId = newDecoded.sub || newData.userId;
				finalAccessToken = newData.accessToken;

				localStorage.setItem("accessToken", newData.accessToken);
				if (newData.userId) localStorage.setItem("userId", newData.userId);
			} else {
				// 🔹 refresh 실패 → 로그아웃
				dispatch({ type: POST_LOGOUT });
				localStorage.clear();
				return;
			}
			}

			// 🔹 userId로 유저 정보 가져오기
			if (finalUserId) {
			try {
				const userData = await dispatch(userApi(finalUserId)); 
				// ⚠️ userApi 응답 구조 확인 필요
				if (userData) {
				finalNickname = userData.nickname;
				localStorage.setItem("nickname", finalNickname);
				}
			} catch (e) {
				console.error("유저 정보 조회 실패:", e);
			}
			}

			// 🔹 최종 상태 Redux에 저장
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