import React from "react";
import styles from "./PaletteCard.module.css";
import { FaPlus } from "react-icons/fa";

function PaletteCard({ palette, onClick, isButton }) {
	const { title, mood, recommendedColors } = palette;

	const colors = Array.isArray(recommendedColors)
		? recommendedColors.flat()
		: [];

	return (
		<div
		className={`${styles.card} ${isButton ? styles.buttonCard : ""}`}
		onClick={onClick ? onClick : undefined}
		style={{ cursor: onClick ? "pointer" : "default" }}
		>
		{isButton ? (
			<div className={styles.buttonContent}>
			<FaPlus className={styles.icon} />
			<div className={styles.title}>{title}</div>
			</div>
		) : (
			<>
			{/* 색상 표시 */}
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