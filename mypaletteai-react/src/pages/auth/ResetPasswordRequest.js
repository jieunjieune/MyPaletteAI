import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordRequestApi } from "../../apis/AuthAPICalls";
import ResetCSS from "./ResetPassword.module.css";

export default function ResetPasswordRequest() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		if (!email) return setError("이메일을 입력해주세요.");

		try {
			await dispatch(resetPasswordRequestApi(email));
			setMessage("이메일을 확인하세요. 재설정 링크가 발송되었습니다!");
		} catch (err) {
			setError(err.message || "요청 실패!");
		}
	};

	return (
		<div className={ResetCSS.background}>
			<div className={ResetCSS.container}>
				<form className={ResetCSS.formCard} onSubmit={handleSubmit}>
					<h1 className={ResetCSS.title}>비밀번호 재설정</h1>
					<p className={ResetCSS.subtitle}>
						가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
					</p>

					<div className={ResetCSS.row}>
						<div className={ResetCSS.rowInner}>
							<label>이메일</label>
							<input
								type="email"
								placeholder="이메일 입력"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					</div>

					{error && <p className={ResetCSS.error}>{error}</p>}
					{message && <p className={ResetCSS.success}>{message}</p>}

					<button className={ResetCSS.submitButton} type="submit">
						재설정 링크 보내기
					</button>
				</form>
			</div>
		</div>
	);
}