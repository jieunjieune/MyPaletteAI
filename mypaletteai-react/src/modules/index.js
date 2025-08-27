import { combineReducers } from "redux";
import authReducer from "./AuthModule";
import todayPaletteReducer from "./TodayPaletteModule";
import paletteReducer from "./PaletteModule";
import makeReducer from "./MakeModule";

const rootReducer = combineReducers({
	authReducer,
	todayPalette: todayPaletteReducer,
	paletteReducer,
	makeReducer
})

export default rootReducer;