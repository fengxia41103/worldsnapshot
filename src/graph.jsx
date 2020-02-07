import React from "react";
import d3plus from "d3plus";
import {DropdownButton, MenuItem} from "react-bootstrap";
import _ from "lodash";
import classNames from "classnames";
import {randomId} from "./helper.jsx";

import D3PlusGraphBox from "./graph-d3.jsx";
import GoogleGraphBox from "./graph-googlechart.jsx";
import GraphDatatable from "./graph-table.jsx";
import HighchartGraphBox from "./graph-highchart.jsx";
import MetricsGraphBox from "./graph-metrics.jsx";
import ChartJSGraphBox from "./graph-chartjs.jsx";
import PlotlyGraphBox from "./graph-plotly.jsx";
import DygraphsGraphBox from "./graph-dygraphs.jsx";
import C3GraphBox from "./graph-c3.jsx";
import WbIndicatorInfo from "./wb-indicator-info.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************
class GraphFactory extends React.Component {
  constructor(props) {
    super(props);

    // state
    const type = !!this.props.type ? "bar" : this.props.type;

    this.state = {
      graphType: type,
      graphEngine: "highchart", // possible values: [D3, Google, Highchart, Metrics]
    };

    //binding
    this.setGraphEngine = this.setGraphEngine.bind(this);
    this.setGraphType = this.setGraphType.bind(this);
  }

  setGraphEngine(newEngine) {
    this.setState({
      graphEngine: newEngine,
    });
  }

  setGraphType(newType) {
    this.setState({
      graphType: newType,
    });
  }

  render() {
    const {data} = this.props;
    const {graphType} = this.state;

    // Validate data set
    if (!Boolean(data)) return null;

    // Country code is an array
    const countries = this.props.countryCode.join("/");

    // Render graph by chart type
    switch (graphType) {
      case "pie":
        // Regroup by year
        const tmp = {};
        for (let i = 0; i < data.length; i++) {
          const year = data[i].year;
          if (tmp.hasOwnProperty(year)) {
            tmp[year].push(data[i]);
          } else {
            tmp[year] = [data[i]];
          }
        }

        // One pie chart per year's data
        const graphs = [];
        for (year in tmp) {
          const containerId = randomId();
          const title = [this.props.title, year].join(" -- ");

          graphs.push(
            <div key={randomId()} style={{display: "inline-block"}}>
              <h3>{countries}</h3>
              <D3PlusGraphBox
                containerId={containerId}
                graphType={graphType}
                {...this.props}
                data={tmp[year]}
                title={title}
              />
            </div>,
          );
        }
        return (
          <div className="my-multicol-2">
            {graphs}
            <div className="divider" />
          </div>
        );

      case "table":
        return (
          <div>
            <h3>{countries}</h3>

            <GraphConfigBox
              graphType={this.state.graphType}
              setGraphType={this.setGraphType}
              graphEngine={this.state.graphEngine}
              setGraphEngine={this.setGraphEngine}
              {...this.props}
            />

            {/* Indicator info */}
            <WbIndicatorInfo {...this.props} />

            <GraphDatatable {...this.props} />
            <div className="divider" />
          </div>
        );

      default:
        // Default graphs
        // container id
        const containerId = randomId();

        return (
          <div className="row">
            <h3>{countries}</h3>

            {/* Graph configurations */}
            <GraphConfigBox
              graphType={this.state.graphType}
              setGraphType={this.setGraphType}
              graphEngine={this.state.graphEngine}
              setGraphEngine={this.setGraphEngine}
              {...this.props}
            />

            {/* Indicator info */}
            <WbIndicatorInfo {...this.props} />

            {/* Graphs */}
            <GraphBox
              containerId={containerId}
              graphType={this.state.graphType}
              graphEngine={this.state.graphEngine}
              {...this.props}
            />

            <div className="divider" />
          </div>
        );
    } // end of switch
  }
}

class GraphBox extends React.Component {
  render() {
    const engine = this.props.graphEngine.toLowerCase();

    switch (engine) {
      case "c3":
        return (
          <div>
            <C3GraphBox {...this.props} />
          </div>
        );
      case "google":
        return (
          <div>
            <GoogleGraphBox {...this.props} />
          </div>
        );
      case "highchart":
        return (
          <div>
            <HighchartGraphBox {...this.props} />
          </div>
        );
      case "metrics":
        return (
          <div>
            <MetricsGraphBox {...this.props} />
          </div>
        );
      case "chartjs":
        return (
          <div>
            <ChartJSGraphBox {...this.props} />
          </div>
        );
      case "plotly":
        return (
          <div>
            <PlotlyGraphBox {...this.props} />
          </div>
        );
      case "dygraphs":
        return (
          <div>
            <DygraphsGraphBox {...this.props} />
          </div>
        );

      case "d3plus":
      default:
        return (
          <div>
            <D3PlusGraphBox {...this.props} />
          </div>
        );
    }
  }
}

class GraphConfigBox extends React.Component {
  render() {
    const randomKey = randomId();
    return (
      <div className="right col l3 m3 s12" style={{zIndex: 999}}>
        <DropdownButton title="config" id={randomKey}>
          <MenuItem className="row">
            <GraphEngineBox
              current={this.props.graphEngine}
              setGraphEngine={this.props.setGraphEngine}
              {...this.props}
            />
          </MenuItem>

          <MenuItem className="row">
            <GraphTypeBox
              current={this.props.graphType}
              setGraphType={this.props.setGraphType}
              {...this.props}
            />
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }
}

class GraphTypeBox extends React.Component {
  render() {
    const current = this.props.current;
    const setGraphType = this.props.setGraphType;
    const types = ["bar", "line", "table"];
    const options = types.map(t => {
      const highlight = classNames("collection-item", {
        "teal lighten-2 grey-text text-lighten-4": current == t,
      });
      return (
        <li key={t} className={highlight} onClick={setGraphType.bind(null, t)}>
          {t}
        </li>
      );
    });

    return (
      <div>
        <li className="collection-header">
          <h5>Graph Type</h5>
        </li>
        {options}
      </div>
    );
  }
}

class GraphEngineBox extends React.Component {
  render() {
    const current = this.props.current.toLowerCase();
    const setGraphEngine = this.props.setGraphEngine;
    const types = [
      "d3Plus",
      "c3",
      "google",
      "highchart",
      "metrics",
      "chartJS",
      "plotly",
      "dygraphs",
    ];
    const options = types.map(t => {
      const highlight = classNames("collection-item", {
        "teal lighten-2 grey-text text-lighten-4": current == t,
      });
      return (
        <li
          key={t}
          className={highlight}
          onClick={setGraphEngine.bind(null, t)}
        >
          {t}
        </li>
      );
    });

    return (
      <div>
        <li className="collection-header">
          <h5>Engine</h5>
        </li>
        {options}
      </div>
    );
  }
}

export default GraphFactory;
