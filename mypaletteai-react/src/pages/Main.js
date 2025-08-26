import { useDispatch, useSelector } from 'react-redux';
import MainCSS from './Main.module.css';
import { useEffect } from 'react';
import { callTodayPaletteApi } from '../apis/TodayPaletteAPICalls';

function Main() {
	const dispatch = useDispatch();
	const todayPalette = useSelector((state) => state.todayPalette);

	useEffect(() => {
		dispatch(callTodayPaletteApi());
	}, [dispatch]);
	
	return (
		<div className={MainCSS.container}>
			{/* 로고 */}
			<div className={MainCSS.logoContainer}>
				<img src="/images/main/mypaletteailogo-white.png" className={MainCSS.logo} />
			</div>

			{/* 팔레트 그리드 */}
			<div className={MainCSS.paletteGrid}>
				{todayPalette?.recommendedColors && (
				<div className={MainCSS.paletteCard}>
				{/* 색상 영역 */}
				<div className={MainCSS.colorBar}>
					{todayPalette.recommendedColors.map((color, index) => (
						<div
						key={index}
						className={MainCSS.colorBlock}
						style={{ backgroundColor: color }}
						></div>
					))}
					</div>
				
					{/* 타이틀 */}
					<div className={MainCSS.cardFooter}>
					<span className={MainCSS.title}>{todayPalette.title}</span>
					</div>
				</div>
				)}

				{/* 예시로 다른 팔레트들 */}
				<div className={MainCSS.paletteCard}>팔레트</div>
				<div className={MainCSS.paletteCard}>팔레트</div>
				<div className={MainCSS.paletteCard}>팔레트</div>
				<div className={MainCSS.paletteCard}>팔레트</div>

				{/* 만들기 버튼 */}
				<div className={MainCSS.paletteCard + " " + MainCSS.createCard}>
				팔레트만들기
				</div>
			</div>
		</div>
	)
}

export default Main;