import React from "react";
import PaletteCard from "./PaletteCard";
import styles from "./PaletteList.module.css";

function PaletteList({ palettes }) {
	return (
		<div className={styles.paletteGrid}>
		{palettes.map((palette, idx) => (
			<PaletteCard key={idx} palette={palette} />
		))}
		</div>
	);
}

export default PaletteList;