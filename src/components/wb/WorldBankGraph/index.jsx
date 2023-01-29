import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { HighchartGraph } from "@fengxia41103/storybook";

const WorldBankGraph = (props) => {
  const { indicator } = props;

  const activeData = useSelector((state) => state.wb.activeData);

  const indicatorData = activeData.filter((x) => x.indicator === indicator);

  if (isEmpty(indicatorData)) return null;

  // get categories
  const [firstSet] = indicatorData;
  const { data: firstSetData } = firstSet;
  const categories = firstSetData.map((x) => x.year);

  const chartData = indicatorData.map((x) => ({
    name: x.countryCode,
    data: x.data.map((x) => x.value),
  }));

  // Render graphs
  const footer = "Source: The World Bank";
  return (
    <HighchartGraph
      title=""
      type="column"
      categories={categories}
      data={chartData}
      footer={footer}
      legendEnabled
    />
  );
};

WorldBankGraph.propTypes = {
  countryCode: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    }),
  ),
};

export default WorldBankGraph;
