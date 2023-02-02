import { every, isEmpty } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
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

import WorldBankIndicatorFilterKeywordList from "@Components/wb/WorldBankIndicatorFilterKeywordList";

import {
  selectFilteredIndicators,
  toggleIndicatorFilterKeyword,
} from "@Models/worldbank";

const WorldBankIndicatorList = () => {
  const [group, setGroup] = useState("source");
  const [searching, setSearching] = useState("");

  const dispatch = useDispatch();

  const group_by_change = (event) => {
    setGroup(event.target.value);
  };

  const search_filter_change = (event) => {
    const keyword = event.target.value.trim().toUpperCase();
    setSearching(keyword);

    dispatch(toggleIndicatorFilterKeyword(keyword));
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
        <FormControlLabel value="source" control={<Radio />} label="Source" />
        <FormControlLabel value="topic" control={<Radio />} label="Topics" />
      </RadioGroup>
    </FormControl>
  );

  const indicators = useSelector((state) => state.wb.indicators);

  const filteredIndicators = useSelector((state) =>
    selectFilteredIndicators(state),
  );

  const getGroupBy = (x) => {
    switch (group) {
      case "source":
        return x.source.value;
      case "topic":
        return x.topics?.[0]?.value;
    }
  };

  return (
    <Box>
      <WorldBankIndicatorFilterKeywordList />

      <SearchTextInput
        debounceTimeout={600}
        title="Filter by Country Name"
        searching={searching}
        searchChangeHandler={search_filter_change}
      />

      <DropdownMenu content={menu} />

      <CountTable
        data={filteredIndicators}
        count_by_lambda={getGroupBy}
        title={`Indicators by ${group}`}
        // MUST: appending a trailing "s"!
        link_to_base={`/${group}s`}
      />
      <Typography variant="h1">
        Total: {indicators.length} indicators
      </Typography>
    </Box>
  );
};

export default WorldBankIndicatorList;
