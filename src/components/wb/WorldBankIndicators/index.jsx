import { countBy } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Typography } from "@mui/material";

import { CountCards } from "@fengxia41103/storybook";

import ShowResource from "@Components/common/ShowResource";

import { setIndicators } from "@Models/worldbank";

const WorldBankIndicators = () => {
  const API =
    "http://api.worldbank.org/v2/indicators?format=json&per_page=17000";

  const dispatch = useDispatch();

  const render_data = (data) => {
    const [summary, indicators] = data;
    const { total } = summary;

    // update store
    dispatch(setIndicators(indicators));

    return (
      <>
        <Typography variant="h1">{total} indicators</Typography>
        <Grid container spacing={1}>
          <CountCards
            data={indicators}
            count_by_lambda={(x) => x.source.value}
            title="Count by Source"
          />
        </Grid>
      </>
    );
  };

  return <ShowResource {...{ resource: API, on_success: render_data }} />;
};

export default WorldBankIndicators;
