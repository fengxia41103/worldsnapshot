import { createSlice } from "@reduxjs/toolkit";
import { uniq } from "lodash";

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
    // save countries from worldbank API
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.countryTotal = action.payload.length;
    },

    // save indicators from worldbank API
    setIndicators: (state, action) => {
      // we map `sourceNote` to new key `description`
      state.indicators = action.payload.map((x) => ({
        ...x,
        description: x.sourceNote,
      }));
      state.indicatorTotal = action.payload.length;
    },

    // save API data given a (countryCode, indicator)
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

    // add a country code to `activeCountries` list
    addActiveCountry: (state, action) => {
      const { activeCountries: existing } = state;
      const { payload: countryCode } = action;

      state.activeCountries = uniq([...existing, countryCode]);
    },
  },
});

export const { setCountries, setIndicators, setActiveData, addActiveCountry } =
  wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
