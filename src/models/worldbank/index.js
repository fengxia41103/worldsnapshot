import { createSlice } from "@reduxjs/toolkit";

export const wbSlice = createSlice({
  name: "wb",
  initialState: {
    countryTotal: 0,
    countries: [],

    indicatorTotal: 0,
    indicators: [],
  },
  reducers: {
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.countryTotal = action.payload.length;
    },

    setIndicators: (state, action) => {
      // we map `sourceNote` to new key `description`
      state.indicators = action.payload.map((x) => ({
        ...x,
        description: x.sourceNote,
      }));
      state.indicatorTotal = action.payload.length;
    },
  },
});

export const { setCountries, setIndicators } = wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
