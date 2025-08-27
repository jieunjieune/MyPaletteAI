import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPaletteApi } from "../../apis/PaletteAPICalls";
import PaletteList from "../../components/palette/PaletteList";
import PaletteCSS from "./Palettes.module.css";

function Palettes() {
	const dispatch = useDispatch();
	const palettes = useSelector((state) => state.paletteReducer);

	console.log("palettes:", palettes);

	useEffect(() => {
		dispatch(callPaletteApi());
	}, [dispatch]);

	return (
		<div className={PaletteCSS.page}>

			<h1 className={PaletteCSS.title}><b>My Palette AI</b>와 함께 만들어진 팔레트 🎨 </h1>

		<div className={PaletteCSS.container}>
			{palettes?.length > 0 ? (
				<PaletteList palettes={palettes} />  // <-- 여기서 사용
			) : (
				<p>팔레트가 없습니다.</p>
			)}
		</div>

		</div>
	)
}

export default Palettes;