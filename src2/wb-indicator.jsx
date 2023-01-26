import React from "react";

import AjaxContainer from "./ajax.jsx";

class WbIndicators extends React.Component {
  constructor(props) {
    super(props);
    this.api =
      "http://api.worldbank.org/v2/indicators?format=json&per_page=17000";
  }

  render() {
    var indicators = this.props.indicators;

    // Update data
    if (
      typeof indicators == "undefined" ||
      (indicators && indicators.length < 1)
    ) {
      return (
        <AjaxContainer
          apiUrl={this.api}
          handleUpdate={this.props.handleUpdate}
        />
      );
    }

    // Render
    return null;
  }
}

export default WbIndicators;
