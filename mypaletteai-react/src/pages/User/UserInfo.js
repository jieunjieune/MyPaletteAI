import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserApi } from "../../apis/UserAPICalls";
import { checkNicknameApi } from "../../apis/AuthAPICalls";
import { useLoginInfo } from "../../hooks/useLoginInfo";
import UserCSS from "./UserInfo.module.css";

export default function UserInfo() {
	const dispatch = useDispatch();
	const { userId, nickname: currentNickname } = useLoginInfo();

	// 닉네임 관련 상태
	const [nickname, setNickname] = useState(currentNickname || "");
	const [isNicknameChecked, setIsNicknameChecked] = useState(false);
	const [nicknameMessage, setNicknameMessage] = useState("");

	// 비밀번호 관련 상태
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// 메시지 상태
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	// 닉네임 중복 확인
	const handleCheckNickname = async () => {
		if (!nickname.trim()) {
		setNicknameMessage("닉네임을 입력해주세요.");
		setIsNicknameChecked(false);
		return;
		}

		try {
		const result = await dispatch(checkNicknameApi(nickname));
		if (result.available) {
			setNicknameMessage(result.message);
			setIsNicknameChecked(true);
		} else {
			setNicknameMessage(result.message);
			setIsNicknameChecked(false);
		}
		} catch (err) {
		setNicknameMessage("중복 확인 실패. 다시 시도해주세요.");
		setIsNicknameChecked(false);
		}
	};

	// 회원정보 수정
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		// 닉네임 변경 시 중복 확인 필수
		if (nickname !== currentNickname && !isNicknameChecked) {
		setError("닉네임 중복 확인을 해주세요.");
		return;
		}

		// 비밀번호 확인
		if (showPasswordFields && newPassword !== confirmPassword) {
		setError("비밀번호가 일치하지 않습니다.");
		return;
		}

		try {
		const updateData = { nickname };
		if (showPasswordFields && newPassword) updateData.password = newPassword;

		const result = await dispatch(updateUserApi(userId, updateData));

		// Redux와 화면 상태 동기화
		setMessage("회원정보가 성공적으로 수정되었습니다!");
		setIsNicknameChecked(false);
		setNicknameMessage("");
		setNewPassword("");
		setConfirmPassword("");

		// 새로고침해서 상태 즉시 반영
		setTimeout(() => {
			window.location.reload();
		  }, 500); // 0.5초 후 새로고침
		
		} catch (err) {
		setError(err.message || "회원정보 수정 실패");
		}
	};

	return (
		<div className={UserCSS.background}>
		<div className={UserCSS.container}>
			<form className={UserCSS.formCard} onSubmit={handleSubmit}>
			<h1 className={UserCSS.title}>회원정보 수정</h1>

			{/* 닉네임 */}
			<div className={UserCSS.row}>
				<div className={UserCSS.rowInner}>
				<label>닉네임</label>
				<input
					type="text"
					value={nickname}
					onChange={(e) => {
					setNickname(e.target.value);
					setIsNicknameChecked(false);
					setNicknameMessage("");
					}}
					required
				/>
				<button type="button" onClick={handleCheckNickname} className={UserCSS.checkButton}>
					중복 확인
				</button>
				</div>
				{nicknameMessage && (
				<p className={isNicknameChecked ? UserCSS.success : UserCSS.error}>
					{nicknameMessage}
				</p>
				)}
			</div>

			{/* 비밀번호 변경 토글 */}
			<div className={UserCSS.rowInner}>
				<button
				type="button"
				onClick={() => setShowPasswordFields(!showPasswordFields)}
				className={UserCSS.passwordButton}
				>
				{showPasswordFields ? "비밀번호 변경 취소" : "비밀번호 변경"}
				</button>
			</div>

			{/* 비밀번호 입력 필드 */}
			{showPasswordFields && (
				<>
				<div className={UserCSS.row}>
					<div className={UserCSS.rowInner}>
					<label>새 비밀번호</label>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="변경하지 않으면 비워두세요"
					/>
					</div>
				</div>
				<div className={UserCSS.row}>
					<div className={UserCSS.rowInner}>
					<label>비밀번호 확인</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					</div>
				</div>
				</>
			)}

			{/* 메시지 */}
			{error && <p className={UserCSS.error}>{error}</p>}
			{message && <p className={UserCSS.success}>{message}</p>}

			<button className={UserCSS.submitButton} type="submit">
				회원정보 수정하기
			</button>
			</form>
		</div>
		</div>
	);
}