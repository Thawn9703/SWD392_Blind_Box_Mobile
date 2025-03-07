import { combineReducers } from "redux";
import globalReducer from "presentation/components/modules/slice";
const rootReducers = combineReducers({
    global: globalReducer,
});

export default rootReducers;
