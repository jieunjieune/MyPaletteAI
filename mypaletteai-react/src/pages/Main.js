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
			<div>
				<img src="/images/main/mypaletteailogo.png" className={MainCSS.logo}/>
			</div>
			<div>
				<h3>오늘의 추천 Palette</h3>
				<h2>{todayPalette?.title}</h2>
				<p>{todayPalette?.mood}</p>
				<div style={{ display: "flex" }}>
				{todayPalette?.recommendedColors?.map((color, index) => (
					<div
					key={index}
					style={{
						width: "60px",
						height: "60px",
						backgroundColor: color,
						border: "1px solid #ccc",
					}}
					></div>
				))}
				</div>
			</div>
		</div>
	)
}

export default Main;