import { groupBy, keys, map } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import {
  ChipListWithClickToggle,
  CountTable,
  DropdownMenu,
  SearchTextInput,
} from "@fengxia41103/storybook";

import WorldBankActiveCountryList from "@Components/wb/WorldBankActiveCountryList";

import { toggleActiveCountry } from "@Models/worldbank";

const WorldBankCountryList = () => {
  const [group, setGroup] = useState("name");
  const [searching, setSearching] = useState("");

  // redux
  const countries = useSelector((state) => state.wb.countries);
  const activeCountries = useSelector((state) => state.wb.activeCountries);
  const dispatch = useDispatch();

  const group_by_change = (event) => {
    setGroup(event.target.value);
  };

  const search_filter_change = (event) => {
    const tmp = event.target.value.trim().toUpperCase();
    setSearching(tmp);
  };

  const menu = (
    <FormControl component="fieldset">
      <FormLabel component="legend">Group By</FormLabel>
      <RadioGroup
        aria-label="Group By"
        name="group_by"
        value={group}
        onChange={group_by_change}
        row
      >
        <FormControlLabel value="name" control={<Radio />} label="Alphabet" />
        <FormControlLabel value="region" control={<Radio />} label="Region" />
      </RadioGroup>
    </FormControl>
  );

  const afterGroupBy = groupBy(
    // filter by partial searching
    countries.filter((x) => x.name.toUpperCase().includes(searching)),
    (x) => {
      switch (group) {
        case "name":
          return x.name.charAt(0);
        case "region":
          return x.region.value;
      }
    },
  );

  const countryClickHandler = (countryCode) => {
    dispatch(toggleActiveCountry(countryCode));
  };

  const sortedIndexes = keys(afterGroupBy).sort();
  const list = map(sortedIndexes, (group) => {
    const countriesInGroup = afterGroupBy[group];

    return (
      <Box key={group} mb={3}>
        <Typography variant="h1" mb={3}>
          {group}
        </Typography>

        <ChipListWithClickToggle
          fullList={countriesInGroup}
          activeList={activeCountries}
          onClick={countryClickHandler}
        />
      </Box>
    );
  });

  return (
    <>
      <Stack direction="row" alignItems="center">
        <WorldBankActiveCountryList />
        <DropdownMenu content={menu} />
      </Stack>

      <SearchTextInput
        title="Filter by Country Name"
        searching={searching}
        searchChangeHandler={search_filter_change}
      />

      {list}
    </>
  );
};

export default WorldBankCountryList;
