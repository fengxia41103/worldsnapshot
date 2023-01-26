import _, { isEmpty, isNil, sortBy } from "lodash";
import React from "react";

import AjaxContainer from "./ajax.jsx";
import GraphFactory from "./graph.jsx";

class DhsGraphContainer extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      data: [],
    };

    // binding
    this._getUrl = this._getUrl.bind(this);
    this._cleanData = this._cleanData.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);
  }

  _getUrl(countryCode, indicators) {
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

    let tmp = [];
    for (let key in queries) {
      let val = queries[key];
      if (val && val.length > 0) {
        tmp.push(key + "=" + val);
      }
    }
    return baseUrl + tmp.join("&");
  }

  _cleanData(data) {
    let tmp = [];

    // Data needs to be massaged
    for (let i = 0; i < data.length; i++) {
      const country = data[i].DHS_CountryCode;
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

    return sortBy(tmp, "year");
  }

  _handleUpdate(data) {
    if (!isNil(data.Data) && !isEmpty(data.Data)) {
      let tmp = _.concat(this.state.data, this._cleanData(data.Data));

      this.setState({
        data: tmp,
      });
    }
  }

  render() {
    // If country code changed, update data
    const currentValue =
      this.props.countryCode && this.props.countryCode.valueOf();
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      const { indicators } = this.props;
      const ajaxReqs = this.props.countryCode.map((c) => {
        const api = this._getUrl(c, indicators);

        return (
          <AjaxContainer
            key={c}
            handleUpdate={this._handleUpdate}
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
