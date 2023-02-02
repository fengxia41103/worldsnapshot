import { groupBy, map, sortBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { Glossary } from "@fengxia41103/storybook";

import WorldBankActiveCountryList from "@Components/wb/WorldBankActiveCountryList";
import WorldBankIndicatorDetail from "@Components/wb/WorldBankIndicatorDetail";
import WorldBankIndicatorFilterKeywordList from "@Components/wb/WorldBankIndicatorFilterKeywordList";

import { selectFilteredIndicators } from "@Models/worldbank";

const WorldBankIndicatorListByTopic = () => {
  // URL params
  const { topic } = useParams();

  const filteredIndicators = useSelector((state) =>
    selectFilteredIndicators(state),
  );

  const myIndicators = filteredIndicators
    // only matching the topic I want
    // MUST: topic string can have trailing whitespace! err!
    .filter((x) => map(x.topics, (t) => t.value?.trim()).includes(topic))

    .map((x) => ({
      ...x,

      // a countries comparison graph on this indicator
      more: <WorldBankIndicatorDetail indicator={x.id} />,
    }));

  const groupByFirstLetter = groupBy(myIndicators, (x) =>
    // the `.name` string sometimes have prefix whitespace!
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
      <WorldBankActiveCountryList />
      <WorldBankIndicatorFilterKeywordList />

      <Typography variant="h1">{topic}</Typography>

      <Glossary terms={terms} />
    </Box>
  );
};

export default WorldBankIndicatorListByTopic;
