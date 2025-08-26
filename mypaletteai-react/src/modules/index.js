import { combineReducers } from "redux";
import authReducer from "./AuthModule";
import todayPaletteReducer from "./TodayPaletteModule";
import paletteReducer from "./PaletteModule";

const rootReducer = combineReducers({
	authReducer,
	todayPalette: todayPaletteReducer,
	paletteReducer
})

export default rootReducer;