// footer.js
import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <footer className="page-footer">
        <div className="container">
          <h5>Data source</h5>
          <ul>
            <li>The World Bank</li>
            <li>USAID</li>
          </ul>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <i className="fa fa-copyright"></i>2020 PY Consulting Ltd.
            <span className="grey-text text-lighten-4 right">
              Made by{" "}
              <a href="https://fengxia41103.github.com/myblog">Feng Xia</a>
            </span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
