import { createSlice } from "@reduxjs/toolkit";

export const wbSlice = createSlice({
  name: "wb",
  initialState: {
    indicators: [],
  },
  reducers: {
    setIndicators: (state, action) => ({
      ...state,
      indicators: action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { setIndicators } = wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
