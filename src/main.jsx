// main.js
require("es5-shim");
require("es5-shim/es5-sham");
require("console-polyfill");
require("font-awesome/css/font-awesome.css");
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap");
require("materialize-loader");
require("./stylesheets/my.css");

import React, {Component} from "react";
import ReactDom from "react-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import RootBox from "./rootbox.jsx";

class Page extends Component {
  render() {
    return (
      <div id="wrap" style={{backgroundColor: "#fefefe"}}>
        <Header />
        <RootBox />
        <Footer />
      </div>
    );
  }
}

// bootstrap the application
ReactDom.render(<Page />, document.getElementById("app"));
