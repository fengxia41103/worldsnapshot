import React from "react";
import c3 from "c3";
import _ from "lodash";
import classNames from "classnames";
import {randomId} from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class C3GraphBox extends React.Component {
  constructor(props) {
    super(props);

    //binding
    this._makeViz = this._makeViz.bind(this);
    this._destroyViz = this._destroyViz.bind(this);
    this._updateGraphData = this._updateGraphData.bind(this);
    this._mapChartType = this._mapChartType.bind(this);
  }

  _makeViz() {
    // Create a clean sheet
    this._destroyViz();

    // Reformat query data to datatable consumable forms.
    const data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    const options = {
      bindto: "#" + this.props.containerId,
      data: {
        x: "x", // hard-coded x-axis indicator
        type: this._mapChartType(this.props.graphType),
        columns: data.series,
      },
    };

    // Render chart
    this.chart = c3.generate(options);
  }

  _mapChartType(askingType) {
    // Map container box GraphType state values to proper chart types
    switch (askingType) {
      case "line":
        return "spline";
      default:
        return askingType;
    }
  }

  _updateGraphData(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    const transposed = _.zip.apply(_, data.datatable);
    const formattedData = data.categories.map((country, index) => {
      const data = transposed[index + 1];
      data.unshift(country);
      return data;
    });

    // Add x-axis data, must be in format
    // ["x", val1, val2, ....] <-- first element
    // is the same character defined in optioon(see above)
    const x = transposed[0];
    x.unshift("x");
    formattedData.unshift(x);

    return {
      categories: data.categories,
      series: formattedData,
    };
  }

  componentDidMount() {
    this._makeViz();

    // Set up data updater
    this.debounceUpdate = _.debounce(data => {
      this._makeViz();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(type => {
      this._makeViz();
    }, 500);
  }

  _destroyViz() {
    if (this.chart != "undefined" && this.chart != null) {
      this.chart.destroy();
    }
  }

  componentWillUnmount() {
    this._destroyViz();
  }

  render() {
    // If data changed
    const currentValue = this.props.data != null && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.chart && this.debounceUpdate) {
        this.debounceUpdate(this.props.data);
      }
    }

    // If type changed
    const currentType = this.props.graphType && this.props.graphType.valueOf();
    if (currentType != null && this.preType !== currentType) {
      this.preType = currentType;

      // Update graph data
      if (this.chart && this.debounceGraphTypeUpdate) {
        this.debounceGraphTypeUpdate(this.props.graphType);
      }
    }

    // Render
    return (
      <div>
        <figure id={this.props.containerId} style={{minHeight: "500px"}}>
          <figcaption>{this.props.title}</figcaption>
        </figure>
      </div>
    );
  }
}

export default C3GraphBox;
