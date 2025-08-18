import { combineReducers } from "redux";
import authReducer from "./AuthModule";

const rootReducer = combineReducers({
	authReducer
})

export default rootReducer;