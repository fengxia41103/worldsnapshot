import React from "react";
import { useSelector } from "react-redux";

import { Box, Typography } from "@mui/material";

import { CountTable } from "@fengxia41103/storybook";

const WorldBankIndicatorList = () => {
  const indicators = useSelector((state) => state.wb.indicators);

  return (
    <Box>
      <CountTable
        data={indicators}
        count_by_lambda={(x) => x.source.value}
        title="Count by Source"
        link_to_base="/sources"
      />
      <Typography variant="h1">Total: {100} indicators</Typography>
    </Box>
  );
};

export default WorldBankIndicatorList;
