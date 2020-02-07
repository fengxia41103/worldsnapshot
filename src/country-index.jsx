import React from "react";
import classNames from "classnames";

class CountryIndex extends React.Component {
  render() {
    // Build A-Z index
    const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    const current = this.props.current;
    const setIndex = this.props.setIndex;
    const index = alphabet.map(letter => {
      const highlight = classNames("waves-effect waves-light", {
        active: current == letter,
      });
      const anchor = "#" + letter;
      return (
        <li
          key={letter}
          className={highlight}
          onClick={setIndex.bind(null, letter)}
        >
          <a href={anchor}>{letter}</a>
        </li>
      );
    });

    // Render
    return (
      <div>
        <nav className="hide-on-med-and-down">
          <div className="nav-wrapper">
            <ul className="left">{index}</ul>
          </div>
        </nav>

        <div
          className="fixed-action-btn click-to-toggle"
          style={{bottom: "5vh"}}
        >
          <a className="btn-floating btn-large waves-effect waves-light teal darken-2">
            <i className="fa fa-bars"></i>
          </a>
          <ul className="my-multicol-3">{index}</ul>
        </div>
      </div>
    );
  }
}

export default CountryIndex;
