import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HeaderCSS from "./global/Header.module.css";
import { POST_LOGOUT } from "../modules/AuthModule";
import { useLoginInfo } from "../hooks/LoginInfo";
import { logoutApi } from "../apis/AuthAPICalls";

function Header() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoggedIn, nickname } = useLoginInfo();

    console.log("지금 로그인한 닉네임? ", nickname);

	const handleLogout = async () => {
		try {
			await logoutApi();
			localStorage.removeItem("accessToken");
			dispatch({ type: POST_LOGOUT });
			navigate("/auth/login");
		} catch (err) {
			alert("로그아웃 실패");
		}
	};

	return (
		<div className={HeaderCSS.headerBox}>
			<div className={`${HeaderCSS.box} flex items-center justify-between`}>
				<Link to="/" className={HeaderCSS.headerLogo}>
					<img src="/images/main/MyPaletteAiLogo.png" alt="로고" className={HeaderCSS.logoImg} />
				</Link>

				<nav className={HeaderCSS.navMenu}>
					<Link to="/palettes">Palette</Link>
					<Link to="/palette/make">Make</Link>
				</nav>

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