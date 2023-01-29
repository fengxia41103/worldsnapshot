import { groupBy, map } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { CountTable, DropdownMenu } from "@fengxia41103/storybook";

const WorldBankCountryList = () => {
  const [group, setGroup] = useState("name");

  const countries = useSelector((state) => state.wb.countries);

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
        <FormControlLabel value="name" control={<Radio />} label="Alphabet" />
        <FormControlLabel value="region" control={<Radio />} label="Region" />
      </RadioGroup>
    </FormControl>
  );

  const afterGroupBy = groupBy(countries, (x) => {
    switch (group) {
      case "name":
        return x.name.charAt(0);
      case "region":
        return x.region.value;
    }
  });

  const list = map(afterGroupBy, (items, group) => {
    const tmp = items.map((i) => (
      <Grid item key={i.id}>
        <Link href={`/countries/${i.iso2Code}`}>
          <Chip label={i.name} />
        </Link>
      </Grid>
    ));
    return (
      <Box key={group} mb={3}>
        <Typography variant="h1" mb={3}>
          {group}
        </Typography>

        <Grid container spacing={1}>
          {tmp}
        </Grid>
      </Box>
    );
  });
  return (
    <>
      <DropdownMenu content={menu} />
      {list}
    </>
  );
};

export default WorldBankCountryList;
