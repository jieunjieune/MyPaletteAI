import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paletteDetailApi } from "../../apis/PaletteAPICalls";
import { savePaletteApi, deleteSavePaletteApi, getSavePalettesApi } from "../../apis/SaveAPICalls";
import DetailCSS from "./PaletteDetail.module.css";
import { useLoginInfo } from "../../hooks/useLoginInfo";

export default function PaletteDetail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { userId } = useLoginInfo();

	const palette = useSelector((state) => state.paletteReducer.detail);
	const savingState = useSelector((state) => state.paletteReducer.saving);
	const saveResult = useSelector((state) => state.paletteReducer.saveResult);

	const savedPalettes = useSelector((state) => state.saveReducer.list || []);

	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState("");
	const [savedId, setSavedId] = useState(null);

	// 1️⃣ 페이지 로드: 팔레트 상세 + 사용자 저장 팔레트 목록 불러오기
	useEffect(() => {
		const fetchData = async () => {
			try {
				await dispatch(paletteDetailApi(id));
				if (userId) await dispatch(getSavePalettesApi());
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [dispatch, id, userId]);

	// 2️⃣ savedPalettes 변경 시 현재 팔레트가 이미 저장됐는지 확인
	useEffect(() => {
		if (userId && savedPalettes.length > 0) {
			const existing = savedPalettes.find(p => p.paletteId === parseInt(id));
			if (existing) setSavedId(existing.saveId);
		}
	}, [savedPalettes, id, userId]);

	const handleCopy = (color) => {
		navigator.clipboard.writeText(color);
		setCopied(color);
		setTimeout(() => setCopied(""), 1500);
	};

	// 3️⃣ 저장 버튼 클릭
	const handleSave = async () => {
		const result = await dispatch(savePaletteApi(id));
		if (result?.savedPalette?.saveId) setSavedId(result.savedPalette.saveId);
	};

	// 4️⃣ 삭제 버튼 클릭
	const handleDelete = async () => {
		if (!savedId) return;
		await dispatch(deleteSavePaletteApi(savedId));
		setSavedId(null);
	};

	if (loading) return <div className={DetailCSS.loading}>불러오는 중...</div>;
	if (!palette) return <div className={DetailCSS.error}>팔레트를 찾을 수 없습니다.</div>;

	return (
		<div className={DetailCSS.container}>
			{/* 색상 바 */}
			<div className={DetailCSS.colorBar}>
				{palette.recommendedColors?.map((color, idx) => (
					<div key={idx} className={DetailCSS.colorItem}>
						<div
							className={DetailCSS.colorBlock}
							style={{ backgroundColor: color }}
						/>
						<div
							className={DetailCSS.colorName}
							onClick={() => handleCopy(color)}
						>
							{color}
							{copied === color && (
								<span className={DetailCSS.copied}>복사✨</span>
							)}
						</div>
					</div>
				))}
			</div>

			{/* 텍스트 정보 */}
			<div className={DetailCSS.info}>
				<h1 className={DetailCSS.title}>{palette.title}</h1>
				<p className={DetailCSS.mood}>{palette.mood}</p>

				{/* 저장 / 삭제 버튼 */}
				{!savedId ? (
					<button
						onClick={handleSave}
						disabled={savingState}
						className={DetailCSS.saveButton}
					>
						{savingState ? "저장 중..." : "저장하기"}
					</button>
				) : (
					<button
						onClick={handleDelete}
						className={DetailCSS.deleteButton}
					>
						삭제하기
					</button>
				)}

				{/* 메시지 표시 */}
				{saveResult?.message && (
					<div className={DetailCSS.saveMessage}>{saveResult.message}</div>
				)}
			</div>
		</div>
	);
}