import classNames from "classnames";
import Highcharts from "highcharts";
import addFunnel from "highcharts/modules/funnel";
import _ from "lodash";
import React from "react";

import { randomId } from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class HighchartGraphBox extends React.Component {
  constructor(props) {
    super(props);

    //binding
    this._makeViz = this._makeViz.bind(this);
    this._updateGraphData = this._updateGraphData.bind(this);
    this._mapChartType = this._mapChartType.bind(this);
  }

  _makeViz() {
    // Reformat query data to datatable consumable forms.
    const data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    const options = {
      chart: {
        type: this._mapChartType(this.props.graphType),
      },
      title: {
        text: this.props.title,
      },
      subtitle: {
        text: this.props.footer,
      },
      xAxis: {
        categories: data.categories, // x axis  are Years
        crosshair: true,
      },
      yAxis: {
        title: {
          text: "Value",
        },
      },
      tooltip: {
        headerFormat:
          '<h5 class="page-header">{point.key}</h5><table class="table table-striped">',
        pointFormat:
          "<tr><td><b>{series.name}</b></td>" + "<td>{point.y:,.2f}</td></tr>",
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: data.series,
    };

    // Render chart
    this.chart = new Highcharts["Chart"](this.props.containerId, options);
  }

  _mapChartType(askingType) {
    // Map container box GraphType state values to proper chart types
    switch (askingType) {
      case "bar":
        return "column";
      default:
        return askingType;
    }
  }

  _updateGraphData(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    const transposed = _.zip.apply(_, data.datatable);

    const highchartData = data.categories.map((country, index) => {
      return {
        name: country,
        data: transposed[index + 1],
      };
    });

    return {
      categories: transposed[0],
      series: highchartData,
    };
  }

  componentDidMount() {
    // Initialize graph
    // Apply funnel after window is present
    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },
    });
    addFunnel(Highcharts);
    this._makeViz();

    // Set up data updater
    const that = this;
    this.debounceUpdate = _.debounce((data) => {
      const datatable = that._updateGraphData(data);
      /* that.chart.update({
       *   series: datatable.series
       * }) */
      that.chart.destroy();
      that._makeViz();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce((type) => {
      that.chart.update({
        chart: {
          type: that._mapChartType(type),
        },
      });
    }, 500);
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    // If data changed
    const currentValue = this.props.data != null && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.chart && this.debounceUpdate) {
        this.debounceUpdate(this.props.unifiedData);
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
        <figure id={this.props.containerId} style={{ minHeight: "500px" }}>
          <figcaption>{this.props.title}</figcaption>
        </figure>
      </div>
    );
  }
}

export default HighchartGraphBox;
