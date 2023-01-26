import React from "react";
import ReactDom from "react-dom";

import Footer from "./footer.jsx";
import Header from "./header.jsx";
import RootBox from "./rootbox.jsx";

const Page = () => {
  return (
    <div id="wrap" style={{ backgroundColor: "#fefefe" }}>
      <Header />
      <RootBox />
      <Footer />
    </div>
  );
};

// bootstrap the application
ReactDom.render(<Page />, document.getElementById("app"));
