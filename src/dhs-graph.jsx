import React from "react";
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";
import _ from "lodash";

class DhsGraphContainer extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      data: [],
    };

    // binding
    this.getUrl = this.getUrl.bind(this);
    this.cleanData = this.cleanData.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  getUrl(countryCode, indicators) {
    // Build DHS API url
    //const baseUrl = "http://api.dhsprogram.com/rest/dhs/v4/data?";

    // 12/15/2016, the DHS API endpoint has changed.
    const baseUrl = "http://api.dhsprogram.com/rest/dhs/data?";
    const queries = {
      countryIds: countryCode,
      indicatorIds: indicators.join(","),
      perpage: 1000, // max for non-registered user

      // return fields must match what is being used in D3 graph
      returnFields: [
        "DHS_countryCode",
        "Indicator",
        "Value",
        "SurveyYear",
      ].join(","),
    };

    const tmp = [];
    for (let key in queries) {
      let val = queries[key];
      if (val && val.length > 0) {
        tmp.push(key + "=" + val);
      }
    }
    return baseUrl + tmp.join("&");
  }

  cleanData(data) {
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      const tmp = [];

      // Data needs to be massaged
      for (let i = 0; i < data.length; i++) {
        let country = data[i].DHS_CountryCode;
        tmp.push({
          country: country,
          uniqueKey: data[i].Indicator + i,

          // in String form, otherwise D3plus will convert "1986" to "1,986"
          year: data[i].SurveyYear,

          value: data[i].Value,
          category: data[i].Indicator,
          text: [country, data[i].Indicator].join("-"), // Label for each data point
        });
      }
      return _.sortBy(tmp, "year");
    }
  }

  handleUpdate(data) {
    this.setState({
      data: _.concat(this.state.data, this.cleanData(data.Data)),
    });
  }

  render() {
    // If country code changed, update data
    const changed = false;
    const currentValue =
      this.props.countryCode && this.props.countryCode.valueOf();
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      const indicators = this.props.indicators;
      const ajaxReqs = this.props.countryCode.map(c => {
        const api = this.getUrl(c, this.props.indicators);
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
    const footer = "Source: USAID DHS Program";
    return (
      <GraphFactory data={this.state.data} footer={footer} {...this.props} />
    );
  }
}

export default DhsGraphContainer;
