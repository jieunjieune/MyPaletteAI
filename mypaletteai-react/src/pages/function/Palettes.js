import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPaletteApi } from "../../apis/PaletteAPICalls";
import PaletteCard from "../../components/palette/PaletteCard";

function Palettes() {
	const dispatch = useDispatch();
	const palettes = useSelector((state) => state.paletteReducer);

	console.log("palettes:", palettes);

	useEffect(() => {
		dispatch(callPaletteApi());
	}, [dispatch]);

	return (
		<div>
			{palettes?.length > 0 ? (
				palettes.map((palette, index) => (
					<PaletteCard key={index} palette={palette} />
				))
			) : (
				<p>팔레트가 없습니다.</p>
			)}
		</div>
	)
}

export default Palettes;