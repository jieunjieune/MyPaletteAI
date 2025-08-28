import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER_INFO, POST_LOGOUT } from "../modules/AuthModule";
import { refreshApi } from "../apis/AuthAPICalls";

export const useLoginInfo = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, userId, accessToken, nickname } = useSelector((state) => state.authReducer);

	console.log("로그인 인포 isLoggedIn? ", isLoggedIn);
	console.log("로그인 인포 userId? ", userId);
	console.log("로그인 인포 nickname? ", nickname);

	useEffect(() => {
		const initializeAuth = async () => {
			const token = localStorage.getItem("accessToken");
			if (token && !isLoggedIn) {
				try {
					// refresh API 호출 → 새 accessToken 발급
					const newToken = await dispatch(refreshApi());
					if (newToken) {
						localStorage.setItem("accessToken", newToken);
						dispatch({
							type: SET_USER_INFO,
							payload: { userId: null, accessToken: newToken }, // userId 필요하면 백에서 받아오기
						});
					}
				} catch (err) {
					console.error("자동 로그인 실패:", err);
					dispatch({ type: POST_LOGOUT });
					localStorage.removeItem("accessToken");
				}
			}
		};
		initializeAuth();
	}, [dispatch, isLoggedIn]);

	return { isLoggedIn, userId, accessToken, nickname };
};

export default useLoginInfo;