import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callMakeApi } from "../../apis/MakeAPICalls";
import PaletteCard from "../../components/palette/PaletteCard";
import MakeCSS from "./Make.module.css";

export default function Make() {
	const dispatch = useDispatch();
	const palette = useSelector((state) => state.makeReducer);

	const mainColors = [
		"red", "orange", "yellow", "green", "blue", "indigo",
		"purple", "pink", "gray", "black", "white", "random"
	];
	const moods = [
		"부드러운","화사한","선명한","차분한","밝은","따뜻한",
		"시원한","청량한","알록달록한","비슷한 색감의",
		"채도가 낮은","파스텔톤의"
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
		<div className={MakeCSS.container}>
		<h2>새 팔레트 생성</h2>

		{/* 메인 색상 선택 */}
		<div className={MakeCSS.section}>
			<h4>메인 색상</h4>
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
		<div className={MakeCSS.section}>
			<h4>무드 선택 (최대 4개)</h4>
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
			<input
				type="text"
				placeholder="직접 입력"
				value={customMood}
				onChange={(e) => setCustomMood(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleCustomMood()}
			/>
			<button onClick={handleCustomMood}>추가</button>
			</div>

			{/* 선택된 무드 표시 */}
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
		</div>

		{/* 추천 색상 수 */}
		<div className={MakeCSS.section}>
			<h4>색조합 수</h4>
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

		{/* 버튼 그룹: 랜덤 선택, 선택 생성, 다시 생성 */}
		<div className={MakeCSS.buttonGroup}>
			<button className={MakeCSS.submitButton} onClick={handleRandomSelect}>
			랜덤 선택
			</button>
			<button className={MakeCSS.submitButton} onClick={handleSubmit}>
			팔레트 만들기
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
			<p>아직 생성된 팔레트가 없습니다.</p>
			)}
		</div>
		</div>
	);
}