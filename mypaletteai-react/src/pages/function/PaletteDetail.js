import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paletteDetailApi } from "../../apis/PaletteAPICalls";
import { savePaletteApi, deleteSavePaletteApi, getSavePalettesApi } from "../../apis/SaveAPICalls";
import DetailCSS from "./PaletteDetail.module.css";
import { useLoginInfo } from "../../hooks/useLoginInfo";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

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

	// 상세 + 저장된 팔레트 조회
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

	// 저장 여부 확인
	useEffect(() => {
		if (userId && savedPalettes.length > 0) {
		const existing = savedPalettes.find((p) => p.paletteId === parseInt(id));
		if (existing) setSavedId(existing.saveId);
		}
	}, [savedPalettes, id, userId]);

	const handleCopy = (color) => {
		navigator.clipboard.writeText(color);
		setCopied(color);
		setTimeout(() => setCopied(""), 1500);
	};

	const handleSave = async () => {
		const result = await dispatch(savePaletteApi(id));
		if (result?.savedPalette?.saveId) setSavedId(result.savedPalette.saveId);
	};

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

			{/* 북마크 버튼: 로그인 했을 때만 보이도록 */}
			{userId && (
			!savedId ? (
				<FaRegBookmark
				className={DetailCSS.bookmarkIcon}
				onClick={handleSave}
				title="저장하기"
				/>
			) : (
				<FaBookmark
				className={DetailCSS.bookmarkIconFilled}
				onClick={handleDelete}
				title="삭제하기"
				/>
			)
			)}

			{/* 메시지 */}
			{saveResult?.message && (
			<div className={DetailCSS.saveMessage}>{saveResult.message}</div>
			)}
		</div>
		</div>
	);
}