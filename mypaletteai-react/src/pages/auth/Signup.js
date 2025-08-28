import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignupCSS from "./Signup.module.css";
import { signupApi } from "../../apis/AuthAPICalls";

export default function Register() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [nickname, setNickname] = useState("");

	const [errors, setErrors] = useState({});
	const [nicknameStatus, setNicknameStatus] = useState(null);

	// 닉네임 중복 체크
	const checkNickname = async (nick) => {
		if (!nick) return;
		try {
		const res = await fetch(`/api/auth/check-nickname?nickname=${nick}`);
		const data = await res.json();
		setNicknameStatus(data.available);
		} catch (e) {
		console.error("닉네임 중복 확인 실패:", e);
		}
	};

	// 입력값 검증 (onBlur 시)
	const validateField = (field) => {
		const newErrors = { ...errors };

		if (field === "email") {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		newErrors.email = emailRegex.test(email) ? "" : "올바른 이메일 주소를 입력해주세요.";
		}

		if (field === "password") {
		const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
		newErrors.password = pwRegex.test(password)
			? ""
			: "비밀번호는 8~20자, 영문+숫자+특수문자를 포함해야 합니다.";
		}

		if (field === "passwordConfirm") {
		newErrors.passwordConfirm = passwordConfirm === password ? "" : "비밀번호가 일치하지 않습니다.";
		}

		if (field === "nickname") {
		const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
		newErrors.nickname = nicknameRegex.test(nickname)
			? ""
			: "닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.";
		if (nicknameStatus === false) newErrors.nickname = "이미 사용 중인 닉네임입니다.";
		}

		setErrors(newErrors);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// 최종 검사
		validateField("email");
		validateField("password");
		validateField("passwordConfirm");
		validateField("nickname");

		if (Object.values(errors).some((msg) => msg)) return;

		try {
		await dispatch(signupApi({ email, password, nickname }));
		// 가입 성공 시 이동
		navigate("/auth/login");
		} catch (err) {
		console.error("회원가입 실패:", err);
		}
	};

	return (
		<div className={SignupCSS.background}>
		<div className={SignupCSS.container}>
		<form className={SignupCSS.formCard} onSubmit={handleSubmit}>
			<h1>My Palette AI 회원가입</h1>

			{/* 이메일 */}
			<div className={SignupCSS.row}>
				<div className={SignupCSS.rowInner}>
					<label>이메일</label>
					<input
						type="email"
						value={email}
						placeholder="ex) mypaletteai@mypaletteai.com"
						onChange={(e) => setEmail(e.target.value)}
						onBlur={() => validateField("email")}
						required
					/>
				</div>
				{errors.email && <p className={SignupCSS.error}>{errors.email}</p>}
			</div>

			{/* 비밀번호 */}
			<div className={SignupCSS.row}>
				<div className={SignupCSS.rowInner}>
					<label>비밀번호</label>
					<input
						type="password"
						value={password}
						placeholder="영문+숫자+특수문자 포함하여 8~20자"
						onChange={(e) => setPassword(e.target.value)}
						onBlur={() => validateField("password")}
						required
					/>
				</div>
				{errors.password && <p className={SignupCSS.error}>{errors.password}</p>}
			</div>

			{/* 비밀번호 확인 */}
			<div className={SignupCSS.row}>
				<div className={SignupCSS.rowInner}>
					<label></label>
					<input
						type="password"
						value={passwordConfirm}
						placeholder="비밀번호 확인"
						onChange={(e) => setPasswordConfirm(e.target.value)}
						onBlur={() => validateField("passwordConfirm")}
						required
					/>
				</div>
				{errors.passwordConfirm && <p className={SignupCSS.error}>{errors.passwordConfirm}</p>}
			</div>

			{/* 닉네임 */}
			<div className={SignupCSS.row}>
				<div className={SignupCSS.rowInner}>
					<label>닉네임</label>
					<input
						type="text"
						value={nickname}
						placeholder="한글, 영문, 숫자 조합의 2~10자"
						onChange={(e) => setNickname(e.target.value)}
						onBlur={() => {
							validateField("nickname");
							checkNickname(nickname);
						}}
						required
					/>
				</div>
				{nicknameStatus === true && <p className={SignupCSS.success}>사용 가능한 닉네임입니다.</p>}
				{nicknameStatus === false && <p className={SignupCSS.error}>이미 사용 중인 닉네임입니다.</p>}
				{errors.nickname && <p className={SignupCSS.error}>{errors.nickname}</p>}
			</div>

			<button className={SignupCSS.submitButton} type="submit">가입하기 ꒰⸝⸝•ᴗ•⸝⸝꒱੭⁾⁾</button>
		</form>
		</div>
		</div>
	);
}