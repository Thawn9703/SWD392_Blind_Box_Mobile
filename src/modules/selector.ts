import { RootState } from "../redux/store";

// Selector to get the counter value from the state
export const selectState = (state: RootState) => state.global;