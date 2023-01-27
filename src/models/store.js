import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import { WorldBankReducer } from "@Models/worldbank";

const rootReducer = combineReducers({
  wb: WorldBankReducer,
});

const GlobalStore = configureStore({
  reducer: rootReducer,
});

export default GlobalStore;
