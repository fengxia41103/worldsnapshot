import React from "react";
import d3plus from "d3plus";
import _ from "lodash";
import classNames from "classnames";
import {randomId} from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************

class D3PlusGraphBox extends React.Component {
  constructor(props) {
    super(props);

    //binding
    this.makeViz = this.makeViz.bind(this);
    this._updateGraphConfig = this._updateGraphConfig.bind(this);
  }

  makeViz() {
    let config = {
      id: "category",
      text: "text",
      labels: true,
      y: "value",
      x: "year",
      time: "year",
      size: this.props.graphType == "line" ? "" : "value",
      shape: {
        interpolate: "basis",
        rendering: "optimizeSpeed",
      },
      footer: {
        position: "top",
        value: this.props.footer,
      },
    };

    // Draw graph
    config = _.merge(config, this._updateGraphConfig(this.props.data));
    this.viz = d3plus
      .viz()
      .container("#" + this.props.containerId)
      .config(config)
      .data(this.props.data)
      .type(this.props.graphType)
      .draw();
  }

  _updateGraphConfig(data) {
    const tmp = _.countBy(data, item => {
      return item.category;
    });

    if (_.size(tmp) > 1) {
      return {
        color: "category",
        legend: {
          align: "end",
          filters: true,
          value: true,
          text: "category",
          title: "category",
        },
      };
    } else {
      return {
        color: "uniqueKey",
        legend: false,
      };
    }
  }

  componentDidMount() {
    // Initialize graph
    this.makeViz();

    // Set up data updater
    const that = this;
    this.debounceUpdate = _.debounce(data => {
      const config = that._updateGraphConfig(data);
      that.viz.config(config);
      that.viz.data(data);
      that.viz.draw();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(type => {
      that.viz.type(type);
      that.viz.size(type == "line" ? "" : "value");
      that.viz.shape(type == "line" ? "line" : "square");

      // Update config
      const config = that._updateGraphConfig(that.props.data);
      that.viz.config(config);
      that.viz.draw();
    }, 500);
  }

  componentWillUnmount() {
    this.viz = null;
  }

  render() {
    // If data changed
    const currentValue = this.props.data != null && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.viz && this.debounceUpdate) {
        this.debounceUpdate(this.props.data);
      }
    }

    // If type changed
    const currentType = this.props.graphType && this.props.graphType.valueOf();
    if (currentType != null && this.preType !== currentType) {
      this.preType = currentType;

      // Update graph data
      if (this.viz && this.debounceGraphTypeUpdate) {
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

export default D3PlusGraphBox;
