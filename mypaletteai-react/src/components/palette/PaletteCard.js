import React from "react";
import styles from "./PaletteCard.module.css";

function PaletteCard({ palette }) {
	const { title, mood, recommendedColors } = palette;

	// 추천색상 배열이 배열 안 배열이면 flat 처리
	const colors = recommendedColors.flat();

	return (
		<div className={styles.card}>
		<div className={styles.colorBar}>
			{colors.map((color, idx) => (
			<div
				key={idx}
				className={styles.colorBlock}
				style={{ backgroundColor: color }}
				title={color}
			></div>
			))}
		</div>
		<div className={styles.cardFooter}>
			<div className={styles.title}>{title}</div>
			<div className={styles.mood}>{mood}</div>
		</div>
		</div>
	);
}

export default PaletteCard;