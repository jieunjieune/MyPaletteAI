import React from "react";
import styles from "./PaletteCard.module.css"

function PaletteCard({ palette }) {
	const { title, mood, mainColor, recommendedColors, message } = palette;

	// 추천 색상이 배열 안 배열이면 flat 처리
	const colors = recommendedColors.flat();

	return (
		<div className={styles.card}>
		<h3 className={styles.title}>{title}</h3>
		<p className={styles.mood}>무드: {mood}</p>
		<p className={styles.mainColor}>
			메인 색상: 
			<span
			className={styles.colorBox}
			style={{ backgroundColor: mainColor }}
			></span>
			{mainColor}
		</p>
		<p className={styles.recommendedColors}>
			추천 색상:{" "}
			{colors.length > 0 ? (
			colors.map((color, idx) => (
				<span
				key={idx}
				className={styles.recommendedBox}
				style={{ backgroundColor: color }}
				title={color}
				></span>
			))
			) : (
			<span>없음</span>
			)}
		</p>
		<small className={styles.message}>{message}</small>
		</div>
	);
}

export default PaletteCard;