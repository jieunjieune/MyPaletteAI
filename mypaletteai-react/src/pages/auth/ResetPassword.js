import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginCSS from "./Login.module.css";
import { resetPasswordConfirmApi } from "../../apis/AuthAPICalls";

export default function ResetPassword() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token"); // URL에서 token 추출

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!token) setError("유효하지 않은 링크입니다.");
	}, [token]);

	const validatePassword = (password) => {
		const minLength = 8;
		const lowercase = /[a-z]/;
		const number = /[0-9]/;
		const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

		if (password.length < minLength) return "비밀번호는 최소 8자 이상이어야 합니다.";
		if (!lowercase.test(password)) return "비밀번호에 소문자를 포함해야 합니다.";
		if (!number.test(password)) return "비밀번호에 숫자를 포함해야 합니다.";
		if (!specialChar.test(password)) return "비밀번호에 특수문자를 포함해야 합니다.";
		return "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		if (!token) {
		setError("유효하지 않은 링크입니다.");
		return;
		}

		const pwdError = validatePassword(newPassword);
		if (pwdError) {
		setError(pwdError);
		return;
		}

		if (newPassword !== confirmPassword) {
		setError("비밀번호가 일치하지 않습니다.");
		return;
		}

		try {
		await dispatch(
			resetPasswordConfirmApi({ resetToken: token, newPassword })
		);
		setMessage("비밀번호가 성공적으로 변경되었습니다!");
		setTimeout(() => navigate("/auth/login"), 2000);
		} catch (err) {
		const errMsg = err?.message || "토큰이 만료되었거나 유효하지 않습니다.";
		setError(errMsg);
		}
	};

	return (
		<div className={LoginCSS.background}>
		<div className={LoginCSS.container}>
			<form className={LoginCSS.formCard} onSubmit={handleSubmit}>
			<h1 className={LoginCSS.title}>비밀번호 재설정</h1>

			<div className={LoginCSS.row}>
				<div className={LoginCSS.rowInner}>
				<label>새 비밀번호</label>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>
				</div>
			</div>

			<div className={LoginCSS.row}>
				<div className={LoginCSS.rowInner}>
				<label>비밀번호 확인</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				</div>
			</div>

			{error && <p className={LoginCSS.error}>{error}</p>}
			{message && <p className={LoginCSS.success}>{message}</p>}

			<button className={LoginCSS.submitButton} type="submit">
				비밀번호 재설정
			</button>
			</form>
		</div>
		</div>
	);
}