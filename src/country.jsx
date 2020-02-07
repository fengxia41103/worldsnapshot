import React from "react";
import IndexBox from "./index.jsx";
import _ from "lodash";
import classNames from "classnames";

//****************************************
//
//    Country containers
//
//****************************************
class CountryBox extends React.Component {
  render() {
    // Index list
    const indexes = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    // API endpoint to get list of items
    const indexItemUrl =
      "http://api.worldbank.org/v2/en/countries?format=json&per_page=1000";

    // Data are items retrieved from API.
    // Depending on its format, we are to extract
    // the actual items to list.
    const getItems = data => {
      return data[1];
    };

    // Determine an index is active
    const isIndexActive = (activeIndex, i) => {
      return activeIndex && activeIndex === i;
    };

    // Determine an item is active
    const isItemActive = (activeItem, i) => {
      return (
        activeItem &&
        _.some(activeItem, item => {
          return i.iso2Code === item.iso2Code;
        })
      );
    };

    // Map a list item to index for grouping
    const itemMapToIndex = i => {
      return i.iso2Code.charAt(0);
    };

    // Item value
    const getItemValue = i => {
      return {
        iso2Code: i.iso2Code,
        name: i.name,
      };
    };

    // Item render display
    const getItemRender = i => {
      return (
        <div>
          {i.name}({i.iso2Code})
        </div>
      );
    };

    // Render
    return (
      <div>
        <IndexBox
          indexes={indexes}
          indexItemUrl={indexItemUrl}
          getItems={getItems}
          isIndexActive={isIndexActive}
          isItemActive={isItemActive}
          itemMapToIndex={itemMapToIndex}
          getItemValue={getItemValue}
          getItemRender={getItemRender}
          {...this.props}
        />
      </div>
    );
  }
}

export default CountryBox;
