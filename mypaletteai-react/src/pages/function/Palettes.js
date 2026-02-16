import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPaletteApi } from "../../apis/PaletteAPICalls";
import PaletteList from "../../components/palette/PaletteList";
import PaletteCSS from "./Palettes.module.css";

function Palettes() {
	const dispatch = useDispatch();
	const palettes = useSelector((state) => state.paletteReducer.list || []);
	const [sortOrder, setSortOrder] = useState("latest"); // "latest" 또는 "oldest"
	const [sortedPalettes, setSortedPalettes] = useState([]);

	useEffect(() => {
		dispatch(callPaletteApi());
	}, [dispatch]);

	useEffect(() => {
		if (!palettes) return;

		const sorted = [...palettes].sort((a, b) => {
			return sortOrder === "latest" ? b.paletteId - a.paletteId : a.paletteId - b.paletteId;
		});

		setSortedPalettes(sorted);
	}, [palettes, sortOrder]);

	return (
		<div className={PaletteCSS.page}>
			<h2 className={PaletteCSS.title}>
				<b>My Palette AI</b>와 함께 만들어진 팔레트 🎨
			</h2>

			{/* 정렬 선택 */}
			<div className={PaletteCSS.sortContainer}>
				<select
					id="sortOrder"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="latest">최신순</option>
					<option value="oldest">오래된순</option>
				</select>
			</div>

			<div className={PaletteCSS.container}>
				{sortedPalettes?.length > 0 ? (
					<PaletteList palettes={sortedPalettes} />
				) : (
					<p>팔레트가 없습니다.</p>
				)}
			</div>
		</div>
	);
}

export default Palettes;