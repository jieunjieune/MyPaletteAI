import { combineReducers } from "redux";
import authReducer from "./AuthModule";
import todayPaletteReducer from "./TodayPaletteModule";

const rootReducer = combineReducers({
	authReducer,
	todayPalette: todayPaletteReducer,
})

export default rootReducer;