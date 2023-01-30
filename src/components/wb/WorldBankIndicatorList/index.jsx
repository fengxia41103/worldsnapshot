import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { CountTable, DropdownMenu } from "@fengxia41103/storybook";

const WorldBankIndicatorList = () => {
  const [group, setGroup] = useState("source");

  const group_by_change = (event) => {
    setGroup(event.target.value);
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
      <DropdownMenu content={menu} />
      <CountTable
        data={indicators}
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
