import React from "react";
import Dygraph from "dygraphs";
import _ from "lodash";
import classNames from "classnames";
import {randomId, randomColorGenerator} from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class DygraphsGraphBox extends React.Component {
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
    const type = this._mapChartType(this.props.graphType);
    const id = this.props.containerId;
    const headers = ["x"].concat(this.props.unifiedData.categories);

    const legendFormatter = data => {
      const legends = data.series.forEach(series => {
        if (!series.isVisible) return;

        let highlight = "";
        if (series.isHighlighted) {
          highlight = "pink darken-3";
        }
        const legendLine = (
          <tr>
            <td className={highlight}>{series.labelHTML}</td>
            <td>{series.yHTML}</td>
          </tr>
        );
      });

      // Legend render
      return (
        <table className="table table-responsive table-hover">{legends}</table>
      );
    };

    const legendFormatter2 = data => {
      if (data.x == null) {
        // This happens when there's no selection and {legend: 'always'} is set.
        return (
          "<br>" +
          data.series
            .map(series => {
              return series.dashHTML + " " + series.labelHTML;
            })
            .join("<br>")
        );
      }

      // BUG: `.getLabels` is not defined!
      let html = this.getLabels()[0] + ": " + data.xHTML;

      data.series.forEach(series => {
        if (!series.isVisible) return;

        let labeledData = series.labelHTML + ": " + series.yHTML;
        if (series.isHighlighted) {
          labeledData =
            '<span class="pink darken-3 white-text">' + labeledData + "</span>";
        }
        html += "<br>" + series.dashHTML + " " + labeledData;
      });
      return html;
    };

    // Darken a color
    const darkenColor = colorStr => {
      // Defined in dygraph-utils.js
      const color = Dygraph.toRGB_(colorStr);
      color.r = Math.floor((255 + color.r) / 2);
      color.g = Math.floor((255 + color.g) / 2);
      color.b = Math.floor((255 + color.b) / 2);
      return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    };

    // This function draws bars for a single series. See
    // multiColumnBarPlotter below for a plotter which can draw multi-series
    // bar charts.
    const barChartPlotter = e => {
      const ctx = e.drawingContext;
      const points = e.points;
      const y_bottom = e.dygraph.toDomYCoord(0);

      ctx.fillStyle = darkenColor(e.color);

      // Find the minimum separation between x-values.
      // This determines the bar width.
      let min_sep = Infinity;
      for (let i = 1; i < points.length; i++) {
        const sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
      }
      const bar_width = Math.floor((2.0 / 3) * min_sep);

      // Do the actual plotting.
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const center_x = p.canvasx;

        ctx.fillRect(
          center_x - bar_width / 2,
          p.canvasy,
          bar_width,
          y_bottom - p.canvasy,
        );

        ctx.strokeRect(
          center_x - bar_width / 2,
          p.canvasy,
          bar_width,
          y_bottom - p.canvasy,
        );
      }
    };

    // Multiple column bar chart
    const multiColumnBarPlotter = e => {
      // We need to handle all the series simultaneously.
      if (e.seriesIndex !== 0) return;

      const g = e.dygraph;
      const ctx = e.drawingContext;
      const sets = e.allSeriesPoints;
      const y_bottom = e.dygraph.toDomYCoord(0);

      // Find the minimum separation between x-values.
      // This determines the bar width.
      let min_sep = Infinity;
      for (let j = 0; j < sets.length; j++) {
        const points = sets[j];
        for (let i = 1; i < points.length; i++) {
          const sep = points[i].canvasx - points[i - 1].canvasx;
          if (sep < min_sep) min_sep = sep;
        }
      }
      const bar_width = Math.floor((2.0 / 3) * min_sep);

      const fillColors = [];
      const strokeColors = g.getColors();
      for (let i = 0; i < strokeColors.length; i++) {
        fillColors.push(darkenColor(strokeColors[i]));
      }

      for (let j = 0; j < sets.length; j++) {
        ctx.fillStyle = fillColors[j];
        ctx.strokeStyle = strokeColors[j];
        for (let i = 0; i < sets[j].length; i++) {
          const p = sets[j][i];
          const center_x = p.canvasx;
          const x_left =
            center_x - (bar_width / 2) * (1 - j / (sets.length - 1));

          ctx.fillRect(
            x_left,
            p.canvasy,
            bar_width / sets.length,
            y_bottom - p.canvasy,
          );

          ctx.strokeRect(
            x_left,
            p.canvasy,
            bar_width / sets.length,
            y_bottom - p.canvasy,
          );
        }
      }
    };

    // Chart options
    const options = {
      labels: headers,
      legend: "always",
      xlabel: "Year",
      highlightSeriesOpts: {strokeWidth: 2},
      legendFormatter: legendFormatter2,
    };

    switch (type) {
      case "bar":
        if (headers.length > 2) {
          // Multi bar charts
          options.plotter = multiColumnBarPlotter;
        } else {
          options.plotter = barChartPlotter;
        }
    }

    // Render chart
    this.containerId = id;
    this.chart = new Dygraph(id, data, options);
  }

  _mapChartType(askingType) {
    // Map container box GraphType state values to proper chart types
    return askingType;
  }

  _updateGraphData(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    const formatted = data.datatable.map(d => {
      d[0] = parseInt(d[0]);
      return d;
    });
    return formatted;
  }

  componentDidMount() {
    // Initialize graph
    this._makeViz();

    // Set up data updater
    const that = this;
    this.debounceUpdate = _.debounce(data => {
      that._makeViz();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(type => {
      that._makeViz();
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
        <figure>
          <figcaption>{this.props.title}</figcaption>
          <div id={this.props.containerId} style={{minHeight: "500px"}} />
        </figure>
      </div>
    );
  }
}

export default DygraphsGraphBox;
