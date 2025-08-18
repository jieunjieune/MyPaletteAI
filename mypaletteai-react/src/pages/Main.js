import MainCSS from './Main.module.css';

function Main() {
	
	return (
		<div className={MainCSS.container}>
			<div>
				<img src="/images/main/mypaletteailogo.png" className={MainCSS.logo}/>
			</div>
			<div>
				<a>오늘의 추천 Palette</a>
			</div>
		</div>
	)
}

export default Main;