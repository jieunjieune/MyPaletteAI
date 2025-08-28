import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginCSS from "./Login.module.css";
import { loginApi } from "../../apis/AuthAPICalls";

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		validateField("email");
		validateField("password");
		if (Object.values(errors).some(msg => msg)) return;

		try {
			await dispatch(loginApi({ email, password }));
			navigate("/"); // 로그인 성공 시 메인 페이지
		} catch (err) {
			console.error("로그인 실패:", err);
			setErrors({ ...errors, global: "로그인 정보가 올바르지 않습니다." });
		}
	};

	return (
		<div className={LoginCSS.background}>
			<div className={LoginCSS.container}>
				<form className={LoginCSS.formCard} onSubmit={handleSubmit}>
					<h1>My Palette AI 로그인</h1>

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

					{/* 글로벌 에러 */}
					{errors.global && <p className={LoginCSS.error}>{errors.global}</p>}

					<button className={LoginCSS.submitButton} type="submit">로그인</button>
				</form>
			</div>
		</div>
	);
}