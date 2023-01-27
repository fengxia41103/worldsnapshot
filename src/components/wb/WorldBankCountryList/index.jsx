import React from "react";
import { useSelector } from "react-redux";

import { Box, Typography } from "@mui/material";

import { CountTable } from "@fengxia41103/storybook";

const WorldBankCountryList = () => {
  const countries = useSelector((state) => state.wb.countries);

  return (
    <Box>
      <CountTable
        data={countries}
        count_by_lambda={(x) => x.region.value}
        title="Countries by Region"
        link_to_base="/countries"
      />
      <Typography variant="h1">Total: {countries.length} Countries</Typography>
    </Box>
  );
};

export default WorldBankCountryList;
