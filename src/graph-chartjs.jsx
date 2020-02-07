import React from "react";
import Chart from "chart.js";
import _ from "lodash";
import classNames from "classnames";
import {randomId, randomColorGenerator} from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class ChartJSGraphBox extends React.Component {
  constructor(props) {
    super(props);

    this.chart = undefined;

    //binding
    this._destroyViz = this._destroyViz.bind(this);
    this._makeViz = this._makeViz.bind(this);
    this._updateGraphData = this._updateGraphData.bind(this);
  }

  _destroyViz() {
    if (!!this.chart) {
      this.chart.destroy();
    }
  }

  _makeViz() {
    // Destroy old one if exists
    this._destroyViz();

    // Reformat query data to datatable consumable forms.
    const data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
      title: {
        display: true,
      },
      animation: {
        animateScale: true,
      },
    };

    // Render chart
    const id = this.props.containerId;
    this.chart = new Chart(id, {
      type: this.props.graphType,
      data: {
        labels: data.categories,
        datasets: data.series,
      },
      options: options,
    });
  }

  _updateGraphData(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    const transposed = _.zip.apply(_, data.datatable);

    const formattedData = data.categories.map(function(country, index) {
      return {
        label: country,
        data: transposed[index + 1],
        fill: false,
        strokeColor: randomColorGenerator(),
        pointColor: randomColorGenerator(),
        backgroundColor: randomColorGenerator(),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
      };
    });

    return {
      categories: transposed[0],
      series: formattedData,
    };
  }

  componentDidMount() {
    // Initialize graph
    this._makeViz();

    // Set up data updater
    const that = this;
    this.debounceUpdate = _.debounce(data => {
      that.chart.data = that._updateGraphData(data);
      that.chart.update();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(type => {
      that._makeViz();
    }, 500);
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
        <figure>
          <figcaption>{this.props.title}</figcaption>
          <canvas
            id={this.props.containerId}
            style={{minHeight: "500px"}}
          ></canvas>
        </figure>
      </div>
    );
  }
}

export default ChartJSGraphBox;
