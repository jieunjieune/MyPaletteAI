import { useState } from "react";
import { useDispatch } from "react-redux";
import SignupCSS from "./Signup.module.css";
import { signupApi } from "../../apis/AuthAPICalls";

export default function Register() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [nickname, setNickname] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== passwordConfirm) {
			alert("비밀번호가 일치하지 않습니다.");
			return;
		}
		dispatch(signupApi({ email, password, nickname }));
	};

	return (
		<div className={SignupCSS.container}>
			<h2>회원가입</h2>
			<form className={SignupCSS.formCard} onSubmit={handleSubmit}>
				<div className={SignupCSS.row}>
					<label>이메일</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className={SignupCSS.row}>
					<label>비밀번호</label>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				<div className={SignupCSS.row}>
					<label>비밀번호 확인</label>
					<input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
				</div>
				<div className={SignupCSS.row}>
					<label>닉네임</label>
					<input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
				</div>
				<button className={SignupCSS.submitButton} type="submit">가입하기</button>
			</form>
		</div>
	);
}