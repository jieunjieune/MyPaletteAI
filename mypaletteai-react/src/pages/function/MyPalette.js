import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginInfo } from "../../hooks/useLoginInfo";
import { myPaletteApi } from "../../apis/PaletteAPICalls";
import PaletteCard from "../../components/palette/PaletteCard";
import MyPaletteCSS from "./MyPalette.module.css";

export default function MyPalette() {
	const { userId } = useLoginInfo();
	const dispatch = useDispatch();

	const palettes = useSelector((state) => state.paletteReducer.myPalettes || []);
	const loading = useSelector((state) => state.paletteReducer.loading);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(3);

	useEffect(() => {
		if (userId) dispatch(myPaletteApi(userId));
	}, [dispatch, userId]);

	// 화면 너비에 따라 visibleCount 변경
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 600) setVisibleCount(1);
			else if (width < 900) setVisibleCount(2);
			else setVisibleCount(3);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!userId) return <div>로그인 후 내 팔레트를 볼 수 있습니다.</div>;
	if (loading) return <div>불러오는 중...</div>;
	if (!palettes || palettes.length === 0) return <div>아직 생성한 팔레트가 없습니다.</div>;

	const maxIndex = Math.max(0, palettes.length - visibleCount);

	const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
	const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

	return (
		<div className={MyPaletteCSS.container}>
			<h1 className={MyPaletteCSS.title}>내가 만든 팔레트</h1>
			<div className={MyPaletteCSS.sliderWrapper}>
				<button
					className={`${MyPaletteCSS.navButton} ${MyPaletteCSS.prevButton}`}
					onClick={handlePrev}
					disabled={currentIndex === 0}
				>
					&lt;
				</button>
				<div
					className={MyPaletteCSS.sliderTrack}
					style={{ transform: `translateX(-${(100 / visibleCount) * currentIndex}%)` }}
				>
					{palettes.map((palette) => (
						<div key={palette.paletteId} className={MyPaletteCSS.gridItem}>
							<PaletteCard palette={palette} />
						</div>
					))}
				</div>
				<button
					className={`${MyPaletteCSS.navButton} ${MyPaletteCSS.nextButton}`}
					onClick={handleNext}
					disabled={currentIndex === maxIndex}
				>
					&gt;
				</button>
			</div>

			<h1 className={MyPaletteCSS.title}>저장한 팔레트</h1>
		</div>
	);
}