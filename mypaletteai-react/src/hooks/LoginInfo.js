import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER_INFO, POST_LOGOUT } from "../modules/AuthModule";
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

			// ✅ 토큰이 있으면 decode
			if (token) {
				try {
					const decoded = jwtDecode(token);
					const decodedUserId = decoded.sub; // 보통 sub에 userId 저장됨
					
					dispatch({
						type: SET_USER_INFO,
						payload: {
							userId: decodedUserId,
							accessToken: token,
							nickname: localStorage.getItem("nickname") || null, // ✅ 닉네임은 로컬에서 불러오기
						},
					});
				} catch (err) {
					console.error("토큰 디코딩 실패:", err);
					dispatch({ type: POST_LOGOUT });
					localStorage.removeItem("accessToken");
					localStorage.removeItem("nickname");
				}
			}
		};
		initializeAuth();
	}, [dispatch]);

	return { isLoggedIn, userId, accessToken, nickname };
};

export default useLoginInfo;