import React from "react";
import styles from "./PaletteCard.module.css";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PaletteCard({ palette, isButton }) {
	const { title, mood, recommendedColors, paletteId } = palette || {};
	const navigate = useNavigate();

	// console.log("팔레트아이디: ", paletteId);

	const colors = Array.isArray(recommendedColors)
		? recommendedColors.flat()
		: [];

	const handleClick = () => {
		if (isButton) {
		// 새 팔레트 만들기 버튼 → 만들기 페이지 이동
		navigate("/palette/make");
		} else {
		// 팔레트 카드 → 상세 페이지 이동
		navigate(`/palettes/${paletteId}`);
		}
	};

	return (
		<div
		className={`${styles.card} ${isButton ? styles.buttonCard : ""}`}
		onClick={handleClick}
		style={{ cursor: "pointer" }}
		>
		{isButton ? (
			<div className={styles.buttonContent}>
			<FaPlus className={styles.icon} />
			<div className={styles.title}>새 팔레트 만들기</div>
			</div>
		) : (
			<>
			{/* 색상 바 */}
			<div className={styles.colorBar}>
				{colors.map((color, idx) => (
				<div
					key={idx}
					className={styles.colorBlock}
					style={{ backgroundColor: color }}
				></div>
				))}
			</div>
			<div className={styles.cardFooter}>
				<div className={styles.title}>{title}</div>
				<div className={styles.mood}>{mood}</div>
			</div>
			</>
		)}
		</div>
	);
}

export default PaletteCard;