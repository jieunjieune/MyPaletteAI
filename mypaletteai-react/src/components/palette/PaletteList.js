import React, { useState } from "react";
import PaletteCard from "./PaletteCard";
import PaletteListCSS from "./PaletteList.module.css";

function PaletteList({ palettes }) {
	const [visibleCount, setVisibleCount] = useState(9);

	const handleLoadMore = () => {
		setVisibleCount(prev => prev + 9);
	};

	return (
		<div>
		<div className={PaletteListCSS.paletteGrid}>
			{palettes.slice(0, visibleCount).map((palette, idx) => (
			<PaletteCard key={idx} palette={palette} />
			))}
		</div>

		{/* 더보기 버튼 */}
		{visibleCount < palettes.length && (
			<div className={PaletteListCSS.loadMoreContainer}>
			<button className={PaletteListCSS.loadMoreButton} onClick={handleLoadMore}>
				더보기
			</button>
			</div>
		)}
		</div>
	);
}

export default PaletteList;