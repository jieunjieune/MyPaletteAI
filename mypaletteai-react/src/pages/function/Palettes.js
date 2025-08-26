import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPaletteApi } from "../../apis/PaletteAPICalls";

function Palettes() {
	const dispatch = useDispatch();
	const palettes = useSelector((state) => state.palettes);

	useEffect(() => {
		dispatch(callPaletteApi());
	}, [dispatch]);

	return (
		<>
			<h1>Palettes!</h1>
		</>
	)
}

export default Palettes;