import classNames from "classnames";
import _ from "lodash";
import MG from "metrics-graphics";
import React from "react";

import { randomId } from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class MetricsGraphBox extends React.Component {
  constructor(props) {
    super(props);

    //binding
    this._makeViz = this._makeViz.bind(this);
    this._updateGraphData = this._updateGraphData.bind(this);
  }

  _updateGraphData(data) {
    const transposed = _.zip.apply(_, data.datatable);

    if (transposed.length < 3) {
      // at least [[year..], [vals..]]
      return this.props.data;
    } else {
      const newData = [];
      const years = transposed[0];
      for (let i = 1; i < transposed.length; i++) {
        let tmp = _.zip(years, transposed[i]);
        tmp = _.forEach(tmp, (val, index) => {
          tmp[index] = {
            year: val[0],
            value: val[1],
          };
        });
        newData.push(tmp);
      }
      return newData;
    }
  }

  _makeViz() {
    const data = this._updateGraphData(this.props.unifiedData);
    const type = this.props.graphType;
    const containerId = this.props.containerId;

    // Update options
    // Note: we do NOT render bar chart using MetricsGraphics
    this.options.chart_type = "line";
    this.options.data = data;
    this.options.target = "#" + containerId;
    this.options.legend = this.props.unifiedData.categories;

    // Render chart
    MG.data_graphic(this.options);
  }

  componentDidMount() {
    // Graph options
    this.options = {
      title: "",
      description: "",
      full_width: true,
      full_height: true,
      rotate_x_labels: 45,
      area: false,
      x_accessor: "year",
      y_accessor: "value",
      legend_target: "div#custom-color-key",
      colors: ["blue", "rgb(255,100,43)", "#CCCCFF"],
      aggregate_rollover: true,
    };

    // Initialize graph
    // Apply funnel after window is present
    this._makeViz();

    // Set up data updater
    const that = this;
    this.debounceUpdate = _.debounce((data) => {
      that._makeViz();
    }, 1000);
  }

  render() {
    // If data changed
    const currentValue = this.props.data != null && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.debounceUpdate) {
        this.debounceUpdate(this.props.data);
      }
    }

    // Render
    return (
      <div>
        <figure id={this.props.containerId} style={{ minHeight: "500px" }}>
          <figcaption>{this.props.title}</figcaption>
        </figure>
      </div>
    );
  }
}

export default MetricsGraphBox;
