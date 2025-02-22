import { combineReducers } from "redux";
import globalReducer from "../modules/slice";
const rootReducers = combineReducers({
    global: globalReducer,
});

export default rootReducers;
