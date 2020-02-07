import React from "react";
import ProgressBox from "./progress.jsx";
import _ from "lodash";

//****************************************
//
//    Common AJAX containers
//
//****************************************
class AjaxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  getData() {
    if (this.state.loading) {
      return null;
    } else {
      this.setState({
        loading: true,
      });
    }

    // Get data
    const api = this.props.apiUrl;
    const handleUpdate = this.props.handleUpdate;
    console.log("Getting: " + api);

    // Work horse
    fetch(api)
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        if (typeof json != "undefined" && json) {
          handleUpdate(json);
        }
      })
      .catch(function(error) {});
  }

  componentWillMount() {
    this.debounceGetData = _.debounce(() => {
      this.getData();
    }, 200);
  }

  render() {
    // Get data
    if (!this.state.loading && this.debounceGetData) {
      this.debounceGetData();
    }
    return (
      // Progress bar
      <ProgressBox />
    );
  }
}

export default AjaxContainer;
