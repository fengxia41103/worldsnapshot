import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

const WorldBankIndicatorsBySource = () => {
  // URL params
  const { source } = useParams();

  const indicators = useSelector((state) => state.wb.indicators);

  const myIndicators = indicators.filter((x) => x.source.value === source);
  const list = myIndicators.map((x) => (
    <Typography variant="body1">{x.name}</Typography>
  ));

  return <Box>{list}</Box>;
};

export default WorldBankIndicatorsBySource;
