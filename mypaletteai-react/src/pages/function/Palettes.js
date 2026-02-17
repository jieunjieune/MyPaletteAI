import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPaletteApi } from "../../apis/PaletteAPICalls";
import PaletteList from "../../components/palette/PaletteList";
import PaletteCSS from "./Palettes.module.css";

function Palettes() {
	const dispatch = useDispatch();
	const palettes = useSelector((state) => state.paletteReducer.list || []);
	const [sortOrder, setSortOrder] = useState("latest"); // 최신순/오래된순
	const [searchTerm, setSearchTerm] = useState(""); // 제목 & 무드 검색
	const [filteredPalettes, setFilteredPalettes] = useState([]);

	useEffect(() => {
		dispatch(callPaletteApi());
	}, [dispatch]);

	useEffect(() => {
		if (!palettes) return;

		// 제목과 무드 기준 필터링
		const filtered = palettes.filter((p) => 
		p.title.includes(searchTerm) || (p.mood && p.mood.includes(searchTerm))
		);

		// 정렬
		const sorted = [...filtered].sort((a, b) => 
		sortOrder === "latest" ? b.paletteId - a.paletteId : a.paletteId - b.paletteId
		);

		setFilteredPalettes(sorted);
	}, [palettes, searchTerm, sortOrder]);

	return (
		<div className={PaletteCSS.page}>
		<h2 className={PaletteCSS.title}>
			<b>My Palette AI</b>와 함께 만들어진 팔레트 🎨
		</h2>

		<div className={PaletteCSS.container}>
			<div className={PaletteCSS.searchSortContainer}>
				<input
				type="text"
				placeholder="제목 또는 무드 검색"
				className={`${PaletteCSS.inputSelectCommon} ${PaletteCSS.searchInput}`}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<select
				id="sortOrder"
				value={sortOrder}
				onChange={(e) => setSortOrder(e.target.value)}
				className={`${PaletteCSS.inputSelectCommon} ${PaletteCSS.selectBox}`}
				>
				<option value="latest">최신순</option>
				<option value="oldest">오래된순</option>
				</select>
			</div>

			{/* 필터된 팔레트 목록 */}
			{filteredPalettes.length > 0 ? (
				<PaletteList palettes={filteredPalettes} />
			) : (
				<p className={PaletteCSS.noResult}>검색 결과가 없습니다.</p>
			)}
			</div>
		</div>
	);
}

export default Palettes;