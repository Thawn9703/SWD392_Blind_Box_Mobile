import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";

const editorSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
    },
});

export const { } = editorSlice.actions;

export default editorSlice.reducer;

