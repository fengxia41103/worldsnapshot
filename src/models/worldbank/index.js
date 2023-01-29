import { createSlice } from "@reduxjs/toolkit";

export const wbSlice = createSlice({
  name: "wb",
  initialState: {
    countryTotal: 0,
    countries: [],

    indicatorTotal: 0,
    indicators: [],

    activeCountries: ["USA", "AUS"],
    activeData: [],
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

    setActiveData: (state, action) => {
      const { countryCode, indicator, data } = action.payload;

      const { activeData } = state;

      state.activeData = [
        ...activeData,
        {
          countryCode,
          indicator,
          data,
        },
      ];
    },
  },
});

export const { setCountries, setIndicators, setActiveData } = wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
