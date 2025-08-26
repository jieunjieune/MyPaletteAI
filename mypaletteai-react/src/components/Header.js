import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import HeaderCSS from "./global/Header.module.css";

function Header() {

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
				<Link to="/palettes">Palette</Link>
				<Link to="/palette/make">Make</Link>
				</nav>
		
				{/* 로그인/회원가입 */}
				<div className={HeaderCSS.authBox}>
				<Link to="/auth/signup">Signup</Link>
				<span> or </span>
				<Link to="/auth/signin">Signin</Link>
				</div>
			</div>
		</div>
	);

}

export default Header;