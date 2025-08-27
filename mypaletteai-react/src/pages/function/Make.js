import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callMakeApi } from "../../apis/MakeAPICalls";
import PaletteCard from "../../components/palette/PaletteCard";
import MakeCSS from "./Make.module.css";
import { FaDice, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

export default function Make() {
	const dispatch = useDispatch();
	const palette = useSelector((state) => state.makeReducer);

	const mainColors = [
		"red", "orange", "yellow", "green", "blue", "indigo",
		"purple", "pink", "gray", "black", "white"
	];
	const moods = [
		"부드러운","화사한","선명한","차분한","밝은","따뜻한",
		"시원한","청량한","알록달록한","비슷한 색감의",
		"채도가 낮은","파스텔톤의", "싱그러운", "차가운", "신비로운", "몽환적인", "현대적인", "잔잔한", "현재 계절에 어울리는", "지금 날씨에 맞는"
	];
	const countOptions = [3,4,5,6,7];

	const [mainColor, setMainColor] = useState("");
	const [selectedMoods, setSelectedMoods] = useState([]);
	const [customMood, setCustomMood] = useState("");
	const [count, setCount] = useState(4);

	// 캐시 초기화
	useEffect(() => {
		dispatch({ type: "make/POST_MAKE", payload: [] });
	}, [dispatch]);

	// 색상 선택
	const handleColorClick = (color) => setMainColor(color);

	// 무드 선택
	const handleMoodClick = (mood) => {
		if (selectedMoods.includes(mood)) {
			setSelectedMoods(selectedMoods.filter((m) => m !== mood));
		} else if (selectedMoods.length < 4) {
			setSelectedMoods([...selectedMoods, mood]);
		}
	};

	// 직접 입력 무드 추가
	const handleCustomMood = () => {
		if (customMood && selectedMoods.length < 4) {
			setSelectedMoods([...selectedMoods, customMood]);
			setCustomMood("");
		}
	};

	// 랜덤 선택 (상태만 갱신)
	const handleRandomSelect = () => {
		const randomColor = mainColors[Math.floor(Math.random() * mainColors.length)];

		const randomMoods = [];
		const moodCount = Math.floor(Math.random() * 4) + 1; // 1~4개 랜덤
		while (randomMoods.length < moodCount) {
			const m = moods[Math.floor(Math.random() * moods.length)];
			if (!randomMoods.includes(m)) randomMoods.push(m);
		}

		const randomCount = countOptions[Math.floor(Math.random() * countOptions.length)];

		setMainColor(randomColor);
		setSelectedMoods(randomMoods);
		setCount(randomCount);
	};

	// 팔레트 생성 (API 요청)
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!mainColor) return alert("메인 색상을 선택해주세요!");

		const moodToSend =
			selectedMoods.length > 0 ? selectedMoods.join(", ") : "random";

		dispatch(
			callMakeApi({
				mainColor,
				mood: moodToSend,
				count,
			})
		);
	};

	return (
		<div className={MakeCSS.background}>
			<div className={MakeCSS.formCard}>
				<h2 className={MakeCSS.title}>Palette AI와 팔레트 생성하기</h2>

				{/* 메인 색상 */}
				<div className={MakeCSS.row}>
					<span className={MakeCSS.label}>Main Color</span>
					<div className={MakeCSS.colorPicker}>
						{mainColors.map((color, idx) => (
							<button
								key={idx}
								className={`${MakeCSS.colorButton} ${mainColor === color ? MakeCSS.selected : ""}`}
								style={{ backgroundColor: color }}
								onClick={() => handleColorClick(color)}
								title={color}
							/>
						))}
					</div>
				</div>

				{/* 무드 선택 */}
				<div className={MakeCSS.row}>
					<span className={MakeCSS.label}>Mood</span>
					<div className={MakeCSS.moodPicker}>
						{moods.map((m, idx) => (
							<button
								key={idx}
								className={`${MakeCSS.moodButton} ${selectedMoods.includes(m) ? MakeCSS.selectedMood : ""}`}
								onClick={() => handleMoodClick(m)}
							>
								{m}
							</button>
						))}
					</div>

					{/* 직접 입력 + 추가 버튼 */}
					<div className={MakeCSS.moodInputWrapper}>
						<input
							type="text"
							placeholder="직접 입력"
							value={customMood}
							onChange={(e) => setCustomMood(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleCustomMood()}
						/>
						<button onClick={handleCustomMood}>+</button>
					</div>
				</div>

				{/* 선택된 무드 태그 */}
				<div className={MakeCSS.selectedMoodList}>
					{selectedMoods.map((m, idx) => (
						<span key={idx} className={MakeCSS.moodTag}>
							{m}
							<button
								className={MakeCSS.deleteTagBtn}
								onClick={() =>
									setSelectedMoods(selectedMoods.filter((mood) => mood !== m))
								}
							>
								✕
							</button>
						</span>
					))}
				</div>

				{/* 추천 색상 수 */}
				<div className={MakeCSS.row}>
					<span className={MakeCSS.label}>Count</span>
					<div className={MakeCSS.countPicker}>
						{countOptions.map((n) => (
							<button
								key={n}
								className={`${MakeCSS.countButton} ${count === n ? MakeCSS.selectedCount : ""}`}
								onClick={() => setCount(n)}
							>
								{n}
							</button>
						))}
					</div>
				</div>

				{/* 버튼 그룹 */}
				<div className={MakeCSS.buttonGroup}>
				<button className={MakeCSS.randomButton} onClick={handleRandomSelect}>
					<FaDice /> random
				</button>
				<button className={MakeCSS.submitButton} onClick={handleSubmit}>
					🎨 팔레트 생성
				</button>
				{palette && palette.title && (
					<button className={MakeCSS.submitButton} onClick={handleSubmit}>
					다시 생성
					</button>
				)}
				</div>

				{/* 결과 */}
				<div className={MakeCSS.resultGrid}>
					{palette && palette.title ? (
						<PaletteCard palette={palette} />
					) : (
						<div>
							<FaQuoteLeft size={16} />
							<span>  어떤 팔레트가 나올까?  </span>
							<FaQuoteRight size={16} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}