import { isUndefined } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChipListWithClickToggle } from "@fengxia41103/storybook";

import { selectActiveCountries, toggleActiveCountry } from "@Models/worldbank";

const WorldBankActiveCountryList = () => {
  const dispatch = useDispatch();

  const activeCountries = useSelector(
    (state) => state.wb.selectActiveCountries,
  );

  if (isUndefined(activeCountries)) return null;

  const countryClickHandler = (countryID) => {
    dispatch(toggleActiveCountry(countryID));
  };

  return (
    <ChipListWithClickToggle
      fullList={activeCountries}
      activeList={activeCountries.map((c) => c.id)}
      onClick={countryClickHandler}
    />
  );
};

export default WorldBankActiveCountryList;
