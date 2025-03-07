import { RootState } from "../../../domain/store/redux/store";

// Selector to get the counter value from the state
export const selectState = (state: RootState) => state.global;