import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginInfo } from "../../hooks/useLoginInfo";
import { myPaletteApi } from "../../apis/PaletteAPICalls";
import { getSavePalettesApi } from "../../apis/SaveAPICalls"; 
import PaletteCard from "../../components/palette/PaletteCard";
import MyPaletteCSS from "./MyPalette.module.css";

export default function MyPalette() {
	const { userId } = useLoginInfo();
	const dispatch = useDispatch();

	// 내가 만든 팔레트
	const palettes = useSelector((state) =>
		Array.isArray(state.paletteReducer.myPalettes) ? state.paletteReducer.myPalettes : []
	);
	const loading = useSelector((state) => state.paletteReducer.loading);

	// 저장한 팔레트
	const savedPalettes = useSelector((state) =>
		Array.isArray(state.saveReducer.list) ? state.saveReducer.list : []
	);
	const saveLoading = useSelector((state) => state.saveReducer.loading);

	// 페이지네이션 상태
	const [visibleMade, setVisibleMade] = useState(6);   // 내가 만든 팔레트 6개씩
	const [visibleSaved, setVisibleSaved] = useState(6); // 저장한 팔레트 6개씩

	// 데이터 불러오기
	useEffect(() => {
		if (userId) {
		dispatch(myPaletteApi(userId));
		dispatch(getSavePalettesApi());
		}
	}, [dispatch, userId]);

	if (!userId) return <div>로그인 후 이용이 가능합니다.</div>;
	if (loading || saveLoading) return <div>불러오는 중...</div>;

	// 공통 렌더 함수
	const renderList = (items, visibleCount, setVisibleCount, label) => {
		const list = Array.isArray(items) ? items : []; // ✅ 안전하게 배열 처리

		if (list.length === 0) {
		return <div className={MyPaletteCSS.noListMessage}>아직 {label} 팔레트가 없습니다 🥲</div>;
		}

		return (
		<>
			<div className={MyPaletteCSS.gridWrapper}>
			{list.slice(0, visibleCount).map((palette) => (
				<div key={palette.paletteId || palette.saveId} className={MyPaletteCSS.gridItem}>
				<PaletteCard palette={palette} />
				</div>
			))}
			</div>
			{visibleCount < list.length && (
			<button
				className={MyPaletteCSS.moreButton}
				onClick={() => setVisibleCount((prev) => prev + 6)} // 6개씩 더보기
			>
				더보기
			</button>
			)}
		</>
		);
	};

	return (
		<div className={MyPaletteCSS.container}>
		<h1 className={MyPaletteCSS.title}>내가 만든 팔레트</h1>
		{renderList(palettes, visibleMade, setVisibleMade, "생성한")}

		<h1 className={MyPaletteCSS.title}>저장한 팔레트</h1>
		{renderList(savedPalettes, visibleSaved, setVisibleSaved, "저장한")}
		</div>
	);
}