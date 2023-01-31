import { groupBy, map, sortBy } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { Glossary } from "@fengxia41103/storybook";

import WorldBankIndicatorDetail from "@Components/wb/WorldBankIndicatorDetail";

import { selectFilteredIndicators } from "@Models/worldbank";

const WorldBankIndicatorListBySource = () => {
  // URL params
  const { source } = useParams();

  const filteredIndicators = useSelector((state) =>
    selectFilteredIndicators(state),
  );

  const myIndicators = filteredIndicators
    .filter((x) => x.source.value === source)
    .map((x) => ({
      ...x,
      more: <WorldBankIndicatorDetail indicator={x.id} />,
    }));

  const groupByFirstLetter = groupBy(myIndicators, (x) =>
    x.name.trim().charAt(0),
  );

  const terms = sortBy(
    map(groupByFirstLetter, (items, firstLetter) => ({
      index: firstLetter,
      items,
    })),
    (x) => x.index,
  );

  return (
    <Box>
      <Typography variant="h1">{source}</Typography>
      <Glossary terms={terms} />
    </Box>
  );
};

export default WorldBankIndicatorListBySource;
