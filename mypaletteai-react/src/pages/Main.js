import { useDispatch, useSelector } from 'react-redux';
import MainCSS from './Main.module.css';
import { useEffect } from 'react';
import { callTodayPaletteApi } from '../apis/TodayPaletteAPICalls';
import { callPaletteApi } from '../apis/PaletteAPICalls';
import PaletteCard from '../components/palette/PaletteCard';
import { useNavigate } from 'react-router-dom';

function Main() {
	const dispatch = useDispatch();
	const navigate = useNavigate(); // <-- 추가
	const todayPalette = useSelector((state) => state.todayPalette);
	const palettes = useSelector(state => state.paletteReducer);

	useEffect(() => {
		dispatch(callTodayPaletteApi());
		dispatch(callPaletteApi());
	}, [dispatch]);

	// 어제의 팔레트
	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}
	const yesterdayStr = `오늘의 팔레트 (${formatDate(new Date(Date.now() - 86400000))})`;
	const yesterdayPalette = palettes.find(p => p.title === yesterdayStr);

	// 가장 최근 3개 팔레트
	const recentPalettes = palettes
		.filter(p => p.title !== yesterdayStr && p.title !== todayPalette.title)
		.slice(-3)
		.reverse();

	return (
		<div className={MainCSS.container}>
			<div className={MainCSS.logoContainer}>
				<img src="/images/main/mypaletteailogo-white.png" className={MainCSS.logo} />
			</div>

			<div className={MainCSS.paletteGrid} style={{ justifyContent: "center", gap: "50px" }}>
				{/* 오늘의 팔레트 */}
				{todayPalette && todayPalette.recommendedColors && (
					<PaletteCard palette={todayPalette} />
				)}

				{/* 어제의 팔레트 (화면에서 이름 변경) */}
				{yesterdayPalette ? (
					<PaletteCard
						palette={{ ...yesterdayPalette, title: "어제의 팔레트", mood: "어제의 무드" }}
					/>
				) : (
					<p>어제의 팔레트가 없습니다.</p>
				)}

				{/* 최근 3개 팔레트 */}
				{recentPalettes.map((p, idx) => (
					<PaletteCard key={idx} palette={p} />
				))}

				{/* 팔레트 만들기 버튼 */}
				<PaletteCard
					palette={{
						title: "새로운 팔레트 만들기",
						mood: "",
						mainColor: "#FFFFFF",
						recommendedColors: [],
						message: ""
					}}
					onClick={() => navigate("/palette/make")}
					isButton={true}
				/>
			</div>
		</div>
	)
}

export default Main;