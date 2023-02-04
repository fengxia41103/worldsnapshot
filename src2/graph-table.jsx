import classNames from "classnames";
import _ from "lodash";
import React from "react";

import { randomId } from "./helper.jsx";

//****************************************
//
//    Common graph containers
//
//****************************************

class GraphDatatable extends React.Component {
  render() {
    const headers = this.props.unifiedData.categories.map((h) => {
      return <th key={randomId()}>{h}</th>;
    });

    const fields = this.props.unifiedData.datatable.map((rows) => {
      const randomKey = randomId();
      const values = rows.map((val) => {
        return <td key={randomId()}>{val}</td>;
      });
      return <tr key={randomKey}>{values}</tr>;
    });

    return (
      <div>
        <figure id={this.props.containerId}>
          <figcaption>{this.props.title}</figcaption>
          <table className="table table-responsive table-striped">
            <thead>
              <th>Year</th>
              {headers}
            </thead>
            <tbody>{fields}</tbody>
          </table>
        </figure>
      </div>
    );
  }
}

export default GraphDatatable;
