import { groupBy, map, sortBy } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { Glossary } from "@fengxia41103/storybook";

const WorldBankSourceIndicatorList = () => {
  // URL params
  const { source } = useParams();

  const indicators = useSelector((state) => state.wb.indicators);

  const myIndicators = indicators.filter((x) => x.source.value === source);

  const groupByFirstLetter = groupBy(myIndicators, (x) =>
    x.name.trim().charAt(0),
  );

  const terms = sortBy(
    map(groupByFirstLetter, (items, index) => ({
      index,
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

export default WorldBankSourceIndicatorList;
