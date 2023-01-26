import classNames from "classnames";
import _ from "lodash";
import React from "react";

import AjaxContainer from "./ajax.jsx";
import GraphFactory from "./graph.jsx";
import { randomId } from "./helper.jsx";

class WbGraphContainer extends React.Component {
  constructor(props) {
    super(props);

    //state
    this.state = {
      data: [],
      unifiedData: [],
      start: "1960",
      end: "2015",
    };

    //binding
    this.getUrl = this.getUrl.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this._cleanData = this._cleanData.bind(this);
    this._unifiedData = this._unifiedData.bind(this);
  }

  getUrl(countryCode, indicator) {
    // Build DHS API url
    const baseUrl = "http://api.worldbank.org/v2/en/countries/";
    const tmp = [countryCode, "indicators", indicator].join("/");
    const query =
      "?date=" +
      this.state.start +
      ":" +
      this.state.end +
      "&format=json&per_page=1000";
    return baseUrl + tmp + query;
  }

  handleUpdate(data) {
    const cleaned = _.concat(this.state.data, this._cleanData(data[1]));
    const unified = this._unifiedData(cleaned);

    this.setState({
      data: cleaned,
      unifiedData: unified,
    });
  }

  _cleanData(data) {
    // WB data cleanse function.
    // Here we are to normalize API data into a data format
    // that is uniform for consumption internally.
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      const tmp = [];
      for (let i = 0; i < data.length; i++) {
        const country = data[i].country.id;

        // Original data can be null or 0,
        // Do NOT skip! Set null to 0.
        let value = 0;
        if (data[i].value !== null) {
          value = parseFloat(data[i].value);
          // Internal data format is a dict.
          tmp.push({
            uniqueKey: country + i,
            country: country,
            year: data[i].date,
            value: value,
            category: country,
            text: [country, data[i].date].join("-"), // Label for each data point
          });
        }
      }

      // Sort data by "date" field
      return _.sortBy(tmp, "year");
    }
  }

  _unifiedData(data) {
    // Unifiy data set to fiill null or zero value for missing data.
    // Not all countries have data for all the years. And even available
    // years don't necessarily lineup nicely. So here we convert data array
    // into a two dimensional array with columues:  Year, country A, country B....
    // and each row is value: [Year, country A value, country B value,....].
    // This format was first designed to generate Google datatable for its chart engine.
    // I think it should also be the base format for other engines.
    const d = d3
      .nest()
      .key((d) => {
        return d.year;
      })
      .key((d) => {
        return d.category;
      })
      .entries(data);

    // Get all categories. This is necessary so we can handle
    // missing values. Otherwise, there will be row
    // that has less values than the number of columns.
    const categories = _.keys(
      _.countBy(data, (item) => {
        return item.category;
      }),
    );

    // Convert format from a flat two-dimension array
    // to a table with columns: year, category 1, category 2, ...
    const datatable = new Array();
    _.forEach(d, (byYear) => {
      const year = byYear.key;
      const values = [];

      const byCategory = _.groupBy(byYear.values, (item) => {
        return item.key;
      });

      _.forEach(categories, (cat) => {
        if (byCategory.hasOwnProperty(cat)) {
          _.forEach(byCategory[cat], (item) => {
            _.forEach(item.values, (val) => {
              values.push(val.value);
            });
          });
        } else {
          values.push(null);
        }
      });
      datatable.push(_.flatten([year, values]));
    });

    // Catregories: list of countries
    // databable: 2D array, each row is [Year, country A value, contry B value, ...]
    return {
      categories: categories,
      datatable: datatable,
    };
  }

  render() {
    // If country code changed, update data
    const currentValue =
      this.props.countryCode && this.props.countryCode.valueOf();
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Iterate through requested countries
      const indicator = this.props.indicator;
      const ajaxReqs = this.props.countryCode.map((c) => {
        const api = this.getUrl(c, indicator);
        return (
          <AjaxContainer
            key={c}
            handleUpdate={this.handleUpdate}
            apiUrl={api}
          />
        );
      });

      return <div>{ajaxReqs}</div>;
    }

    // Render graphs
    const footer = "Source: The World Bank";
    return (
      <div>
        {/* Graph */}
        <GraphFactory
          data={this.state.data}
          unifiedData={this.state.unifiedData}
          footer={footer}
          {...this.props}
        />
      </div>
    );
  }
}

export default WbGraphContainer;
