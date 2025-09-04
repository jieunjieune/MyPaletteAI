import { combineReducers } from "redux";
import authReducer from "./AuthModule";
import todayPaletteReducer from "./TodayPaletteModule";
import paletteReducer from "./PaletteModule";
import makeReducer from "./MakeModule";
import userReducer from "./UserModule";
import saveReducer from "./SaveModule";

const rootReducer = combineReducers({
	authReducer,
	todayPalette: todayPaletteReducer,
	paletteReducer,
	makeReducer,
	userReducer,
	saveReducer
})

export default rootReducer;