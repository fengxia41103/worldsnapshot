import React from 'react';
import AjaxContainer from "./ajax.jsx";

class WbIndicators extends React.createClass{
  getInitialState() {
    this.api = "http://api.worldbank.org/v2/indicators?format=json&per_page=17000";
    return null;
  }

  render() {
    var indicators = this.props.indicators;

    // Update data
    if (typeof indicators == "undefined" || (indicators && indicators.length < 1)) {
      return ( <
        AjaxContainer apiUrl = {
          this.api
        }
        handleUpdate = {
          this.props.handleUpdate
        }
        />
      );
    }

    // Render
    return null;
  }
}

module.exports = WbIndicators;
