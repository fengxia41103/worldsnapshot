import { createSelector, createSlice } from "@reduxjs/toolkit";
import { every, isEmpty, remove, uniq } from "lodash";

export const wbSlice = createSlice({
  name: "wb",
  initialState: {
    countryTotal: 0,
    countries: [],

    indicatorTotal: 0,
    indicators: [],

    // selected countries we want to examine
    activeCountries: ["USA", "AUS"],

    // inputed keywords used to filter indicators
    indicatorFilterKeywords: [],

    // saved API data, each represents a (country, indicator) combo
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

    // add or remove a country code to/from `activeCountries` list
    toggleActiveCountry: (state, action) => {
      const { activeCountries: existing } = state;
      const { payload: newCountryCode } = action;

      if (newCountryCode.trim().length === 0) return;

      if (existing.includes(newCountryCode)) {
        // if it's in existing, remove it
        state.activeCountries = existing.filter((x) => x !== newCountryCode);
      } else {
        // add to list
        state.activeCountries = uniq([...existing, newCountryCode]);
      }
    },

    // add or remove a keyword to/from `indicatorFilterKeywords` list
    toggleIndicatorFilterKeyword: (state, action) => {
      const { indicatorFilterKeywords: existing } = state;
      const { payload: newKeyword } = action;

      if (newKeyword.trim().length === 0) return;

      if (existing.includes(newKeyword)) {
        // if it's in existing, remove it
        state.indicatorFilterKeywords = existing.filter(
          (x) => x !== newKeyword,
        );
      } else {
        // add to list
        state.indicatorFilterKeywords = uniq([...existing, newKeyword]);
      }
    },
  },
});

const selectIndicators = (state) => state.wb.indicators;
const selectIndicatorFilterKeywords = (state) =>
  state.wb.indicatorFilterKeywords;

export const selectFilteredIndicators = createSelector(
  selectIndicators,
  selectIndicatorFilterKeywords,
  (indicators, keywords) => {
    return indicators.filter((indicator) => {
      const matchMe = keywords.map(
        (keyword) =>
          indicator.name.toUpperCase().includes(keyword) ||
          indicator.sourceNote.toUpperCase().includes(keyword),
      );

      // if any is a true, we have a match
      return isEmpty(keywords) || every(matchMe);
    });
  },
);

export const {
  setCountries,
  setIndicators,
  setActiveData,
  toggleActiveCountry,
  toggleIndicatorFilterKeyword,
} = wbSlice.actions;

export const WorldBankReducer = wbSlice.reducer;
