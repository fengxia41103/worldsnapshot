import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChipListWithClickToggle } from "@fengxia41103/storybook";

import {
  selectFilteredIndicators,
  toggleIndicatorFilterKeyword,
} from "@Models/worldbank";

const WorldBankIndicatorFilterKeywordList = () => {
  const dispatch = useDispatch();

  const indicatorFilterKeywords = useSelector(
    (state) => state.wb.indicatorFilterKeywords,
  );

  const keywordClickHandler = (keyword) => {
    dispatch(toggleIndicatorFilterKeyword(keyword));
  };

  return (
    <ChipListWithClickToggle
      fullList={indicatorFilterKeywords.map((keyword) => ({
        id: keyword,
        name: keyword,
      }))}
      activeList={indicatorFilterKeywords}
      onClick={keywordClickHandler}
    />
  );
};

export default WorldBankIndicatorFilterKeywordList;
