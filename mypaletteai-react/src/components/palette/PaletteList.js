import React from "react";
import styles from "./PaletteCard.module.css";

function PaletteCard({ palette }) {
	const { title, mood, mainColor, recommendedColors, message } = palette;

	return (
		<div className={styles.card}>
		<h3 className={styles.title}>{title}</h3>
		<p className={styles.mood}>무드: {mood}</p>

		<div className={styles.mainColorWrapper}>
			메인 색상:
			<span
			className={styles.mainColorBox}
			style={{ backgroundColor: mainColor }}
			></span>
			{mainColor}
		</div>

		<div className={styles.recommendedColors}>
			추천 색상:
			{recommendedColors.length > 0 ? (
			recommendedColors.map((color, idx) => (
				<span
				key={idx}
				className={styles.colorCircle}
				style={{ backgroundColor: color }}
				title={color}
				></span>
			))
			) : (
			<span>없음</span>
			)}
		</div>

		<small className={styles.message}>{message}</small>
		</div>
	);
}

export default PaletteCard;