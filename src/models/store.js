import { configureStore } from "@reduxjs/toolkit";

import { WorldBankReducer } from "@Models/worldbank";

const GlobalStore = configureStore({
  reducer: WorldBankReducer,
});

export default GlobalStore;
