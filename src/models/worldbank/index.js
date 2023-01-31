import { createSlice } from "@reduxjs/toolkit";
import { remove, uniq } from "lodash";

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

    // add or remove a country code to `activeCountries` list
    toggleActiveCountry: (state, action) => {
      const { activeCountries: existing } = state;
      const { payload: newCountryCode } = action;

      if (existing.includes(newCountryCode)) {
        // if it's in existing, remove it
        state.activeCountries = existing.filter((x) => x !== newCountryCode);
      } else {
        // add to list
        state.activeCountries = uniq([...existing, newCountryCode]);
      }
    },
  },
});

export const {
  setCountries,
  setIndicators,
  setActiveData,
  toggleActiveCountry,
} = wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
