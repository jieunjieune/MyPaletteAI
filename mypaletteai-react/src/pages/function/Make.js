import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callMakeApi } from "../../apis/MakeAPICalls";
import PaletteCard from "../../components/palette/PaletteCard";
import MakeCSS from "./Make.module.css";
import { FaDice, FaQuoteLeft, FaQuoteRight, FaPaintBrush } from "react-icons/fa";
import { useLoginInfo } from "../../hooks/useLoginInfo";

export default function Make() {
	const dispatch = useDispatch();
	const palette = useSelector((state) => state.makeReducer);
	const { userId } = useLoginInfo();

	const mainColors = [
		"red","orange","yellow","green","blue","indigo",
		"purple","pink","gray","black","white"
	];
	const moods = [
		"부드러운","화사한","선명한","차분한","밝은","따뜻한",
		"시원한","청량한","알록달록한","비슷한 색감의",
		"채도가 낮은","파스텔톤의", "싱그러운", "차가운", "신비로운",
		"몽환적인", "현대적인", "잔잔한", "현재 계절에 어울리는", "지금 날씨에 맞는"
	];
	const countOptions = [3,4,5,6,7];

	const [mainColor, setMainColor] = useState("");
	const [selectedMoods, setSelectedMoods] = useState([]);
	const [customMood, setCustomMood] = useState("");
	const [count, setCount] = useState(4);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch({ type: "make/POST_MAKE", payload: [] });
	}, [dispatch]);

	const handleColorClick = (color) => setMainColor(color);

	const handleMoodClick = (mood) => {
		if (selectedMoods.includes(mood)) {
		setSelectedMoods(selectedMoods.filter((m) => m !== mood));
		} else if (selectedMoods.length < 4) {
		setSelectedMoods([...selectedMoods, mood]);
		}
	};

	const handleCustomMood = () => {
		if (customMood && selectedMoods.length < 4) {
		setSelectedMoods([...selectedMoods, customMood]);
		setCustomMood("");
		}
	};

	const handleRandomSelect = () => {
		const randomColor = mainColors[Math.floor(Math.random() * mainColors.length)];
		const randomMoods = [];
		const moodCount = Math.floor(Math.random() * 4) + 1;
		while (randomMoods.length < moodCount) {
		const m = moods[Math.floor(Math.random() * moods.length)];
		if (!randomMoods.includes(m)) randomMoods.push(m);
		}
		const randomCount = countOptions[Math.floor(Math.random() * countOptions.length)];

		setMainColor(randomColor);
		setSelectedMoods(randomMoods);
		setCount(randomCount);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!mainColor) return alert("메인 색상을 선택해주세요!");

		const moodToSend = selectedMoods.length > 0 ? selectedMoods.join(", ") : "random";
		setLoading(true);
		try {
		await dispatch(callMakeApi({ mainColor, mood: moodToSend, count, userId }));
		} finally {
		setLoading(false);
		}
	};

	return (
		<div className={MakeCSS.background}>
		<div className={MakeCSS.formCard}>
			<h1 className={MakeCSS.title}>My Palette AI와 팔레트 생성하기</h1>

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

			{/* 무드 */}
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

			{/* 선택된 무드 */}
			<div className={MakeCSS.selectedMoodList}>
			{selectedMoods.map((m, idx) => (
				<span key={idx} className={MakeCSS.moodTag}>
				{m}
				<button
					className={MakeCSS.deleteTagBtn}
					onClick={() => setSelectedMoods(selectedMoods.filter((x) => x !== m))}
				>
					✕
				</button>
				</span>
			))}
			</div>

			{/* Count */}
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
				{/* 선택 초기화 버튼 */}
					<button
						className={MakeCSS.resetButton}
						onClick={() => {
							setMainColor("");
							setSelectedMoods([]);
							setCustomMood("");
							setCount(4);
						}}
					>
						선택 초기화
					</button>
			<button className={MakeCSS.randomButton} onClick={handleRandomSelect}>
				<FaDice /> random
			</button>
			<button className={MakeCSS.submitButton} onClick={handleSubmit}>
				🎨 팔레트 생성
			</button>
			</div>

			{/* 결과 */}
			<div className={MakeCSS.resultGrid}>
			{loading ? (
				<div className={MakeCSS.loading}>
				<FaPaintBrush className={`${MakeCSS.brush} ${MakeCSS.brush1}`} />
				<FaPaintBrush className={`${MakeCSS.brush} ${MakeCSS.brush2}`} />
				<FaPaintBrush className={`${MakeCSS.brush} ${MakeCSS.brush3}`} />
				</div>
			) : palette && palette.title ? (
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