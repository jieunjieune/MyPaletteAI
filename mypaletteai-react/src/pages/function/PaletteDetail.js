import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paletteDetailApi } from "../../apis/PaletteAPICalls";
import { savePaletteApi } from "../../apis/SaveAPICalls";
import DetailCSS from "./PaletteDetail.module.css";

export default function PaletteDetail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const palette = useSelector((state) => state.paletteReducer.detail);
	const savingState = useSelector((state) => state.paletteReducer.saving); // 저장 상태
	const saveResult = useSelector((state) => state.paletteReducer.saveResult); // 저장 메시지
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState("");

	useEffect(() => {
		const fetchDetail = async () => {
			try {
				await dispatch(paletteDetailApi(id));
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [dispatch, id]);

	const handleCopy = (color) => {
		navigator.clipboard.writeText(color);
		setCopied(color);
		setTimeout(() => setCopied(""), 1500);
	};

	const handleSave = async () => {
		await dispatch(savePaletteApi(id)); // ✅ Redux 액션 사용
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

				{/* 저장 버튼 */}
				<button
					onClick={handleSave}
					disabled={savingState}
					className={DetailCSS.saveButton}
				>
					{savingState ? "저장 중..." : "저장하기"}
				</button>
				{saveResult?.message && (
					<div className={DetailCSS.saveMessage}>{saveResult.message}</div>
				)}
			</div>
		</div>
	);
}