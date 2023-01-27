import { groupBy, map } from "lodash";
import React from "react";
import { useSelector } from "react-redux";

import { Box, Chip, Grid, Link, Typography } from "@mui/material";

import { CountTable } from "@fengxia41103/storybook";

const WorldBankCountryList = () => {
  const countries = useSelector((state) => state.wb.countries);

  const groupByRegion = groupBy(countries, (x) => x.region.value);

  const list = map(groupByRegion, (items, region) => {
    const tmp = items.map((i) => (
      <Grid item key={i.id}>
        <Link href={`/countries/${i.iso2Code}`}>
          <Chip label={i.name} />
        </Link>
      </Grid>
    ));
    return (
      <Box key={region} mb={3}>
        <Typography variant="h1" mb={3}>
          {region}
        </Typography>

        <Grid container spacing={1}>
          {tmp}
        </Grid>
      </Box>
    );
  });
  return <>{list}</>;
};

export default WorldBankCountryList;
