import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LoginCSS from "./Login.module.css";
import { loginApi } from "../../apis/AuthAPICalls";

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 이메일 기억하기(localStorage)
	const savedEmail = localStorage.getItem("rememberEmail") || "";
	const [email, setEmail] = useState(savedEmail);
	const [password, setPassword] = useState("");
	const [rememberEmail, setRememberEmail] = useState(!!savedEmail);
	const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
	const [errors, setErrors] = useState({});

	// 유효성 검사
	const validateField = (field) => {
		const newErrors = { ...errors };
		if (field === "email") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			newErrors.email = emailRegex.test(email) ? "" : "올바른 이메일 주소를 입력해주세요.";
		}
		if (field === "password") {
			newErrors.password = password ? "" : "비밀번호를 입력해주세요.";
		}
		setErrors(newErrors);
	};

	// 제출
	const handleSubmit = async (e) => {
		e.preventDefault();
		validateField("email");
		validateField("password");
		if (Object.values(errors).some(msg => msg)) return;

		try {
			const result = await dispatch(loginApi({ email, password }));

			// 이메일 기억하기
			if (rememberEmail) localStorage.setItem("rememberEmail", email);
			else localStorage.removeItem("rememberEmail");

			// 자동 로그인 체크
			if (rememberMe) localStorage.setItem("rememberMe", "true");
			else localStorage.removeItem("rememberMe");

			navigate("/"); // 로그인 성공
		} catch (err) {
			console.error("로그인 실패:", err);
			setErrors({ ...errors, global: "로그인 정보가 올바르지 않습니다." });
		}
	};

	return (
		<div className={LoginCSS.background}>
			<div className={LoginCSS.container}>
				<form className={LoginCSS.formCard} onSubmit={handleSubmit}>
					<h1 className={LoginCSS.title}>My Palette AI 로그인</h1>

					{/* 이메일 */}
					<div className={LoginCSS.row}>
						<div className={LoginCSS.rowInner}>
							<label>이메일</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={() => validateField("email")}
								required
							/>
						</div>
						{errors.email && <p className={LoginCSS.error}>{errors.email}</p>}
					</div>

					{/* 비밀번호 */}
					<div className={LoginCSS.row}>
						<div className={LoginCSS.rowInner}>
							<label>비밀번호</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onBlur={() => validateField("password")}
								required
							/>
						</div>
						{errors.password && <p className={LoginCSS.error}>{errors.password}</p>}
					</div>

					{/* 이메일 기억하기 */}
					<div className={LoginCSS.rowInner}>
						<input
							type="checkbox"
							checked={rememberEmail}
							onChange={(e) => setRememberEmail(e.target.checked)}
						/>
						<label>이메일 기억하기</label>
					</div>

					{/* 자동 로그인 체크 */}
					<div className={LoginCSS.rowInner}>
						<input
							type="checkbox"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
						/>
						<label>자동 로그인</label>
					</div>

					{/* 글로벌 에러 */}
					{errors.global && <p className={LoginCSS.error}>{errors.global}</p>}

					{/* 비밀번호 찾기 / 회원가입 버튼 */}
					<div className={LoginCSS.linkRow}>
						<Link to="/auth/signup" className={LoginCSS.linkButton}>
							회원가입
						</Link>
						<Link to="/auth/reset-password-request" className={LoginCSS.linkButton}>
							비밀번호 찾기
						</Link>
					</div>

					<button className={LoginCSS.submitButton} type="submit">
						(*˙˘˙)♡ 로그인 ♡(˙˘˙*)
					</button>
				</form>
			</div>
		</div>
	);
}