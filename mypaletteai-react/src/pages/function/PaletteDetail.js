import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paletteDetailApi } from "../../apis/PaletteAPICalls";
import DetailCSS from "./PaletteDetail.module.css";

export default function PaletteDetail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const palette = useSelector((state) => state.paletteReducer.detail);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(""); // ✅ 복사된 색상 저장

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
		setTimeout(() => setCopied(""), 1500); // 1.5초 후 초기화
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
		</div>
		</div>
	);
}