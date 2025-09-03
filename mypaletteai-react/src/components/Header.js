import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HeaderCSS from "./global/Header.module.css";
import { POST_LOGOUT } from "../modules/AuthModule";
import { useLoginInfo } from "../hooks/useLoginInfo";
import { logoutApi } from "../apis/AuthAPICalls";

function Header() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoggedIn, nickname, userId } = useLoginInfo();

	const handleLogout = async () => {
		try {
		await logoutApi();
		localStorage.removeItem("accessToken");
		localStorage.removeItem("nickname");
		localStorage.removeItem("userId");
		dispatch({ type: POST_LOGOUT });
		navigate("/auth/login");
		} catch (err) {
		alert("로그아웃 실패");
		}
	};

	return (
		<div className={HeaderCSS.headerBox}>
		<div className={`${HeaderCSS.box} flex items-center justify-between`}>
			{/* 로고 */}
			<Link to="/" className={HeaderCSS.headerLogo}>
			<img
				src="/images/main/MyPaletteAiLogo.png"
				alt="로고"
				className={HeaderCSS.logoImg}
			/>
			</Link>

			{/* 메뉴 */}
			<nav className={HeaderCSS.navMenu}>
			<Link to="/palettes" className={HeaderCSS.menuItem}>팔레트 탐색</Link>
			<Link to="/palette/make" className={HeaderCSS.menuItem}>팔레트 만들기</Link>
			{isLoggedIn && userId && (
				<Link to={`/palettes/my/${userId}`} className={HeaderCSS.myPaletteButton}>내 팔레트⛧</Link>
			)}
			</nav>

			{/* 로그인/닉네임 + 로그아웃 */}
			<div className={HeaderCSS.authBox}>
			{isLoggedIn ? (
				<>
				<span>{nickname}님, 반갑습니다 ⌯•ᴗ•⌯ಣ</span>
				<button onClick={handleLogout} className={HeaderCSS.logoutButton}>
					Logout
				</button>
				</>
			) : (
				<>
				<Link to="/auth/signup">Signup</Link>
				<span> or </span>
				<Link to="/auth/login">Signin</Link>
				</>
			)}
			</div>
		</div>
		</div>
	);
}

export default Header;