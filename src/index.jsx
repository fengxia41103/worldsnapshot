import React from "react";
import AjaxContainer from "./ajax.jsx";
import _ from "lodash";
import classNames from "classnames";
import {randomId} from "./helper.jsx";

// Index can be numbers, so prepend an arbitrary letter
// to make HTML acceptable ID string
const FAKED_PREFIX = "XYZ-";

//****************************************
//
//    Index containers
//
//****************************************

class IndexBox extends React.Component {
  constructor(props) {
    super(props);

    //state
    this.state = {
      items: [],
      index: "S",
    };

    //binding
    this.setIndex = this.setIndex.bind(this);
    this.setItems = this.setItems.bind(this);
  }

  setIndex(letter) {
    this.setState({
      index: letter,
    });
  }

  setItems(data) {
    // Save list items
    this.setState({
      items: this.props.getItems(data),
    });
  }

  render() {
    // Get items to list
    if (
      typeof this.state.items == "undefined" ||
      (this.state.items && this.state.items.length < 1)
    ) {
      return (
        <AjaxContainer
          apiUrl={this.props.indexItemUrl}
          handleUpdate={this.setItems}
        />
      );
    }

    // Render
    return (
      <div>
        <IndexList
          activeIndex={this.state.index}
          setIndex={this.setIndex}
          {...this.props}
        />

        <ItemList
          activeIndex={this.state.index}
          items={this.state.items}
          {...this.props}
        />
      </div>
    );
  }
}

class IndexList extends React.Component {
  render() {
    // Build A-Z index
    const indexes = this.props.indexes;
    const activeIndex = this.props.activeIndex;
    const setIndex = this.props.setIndex;
    const isIndexActive = this.props.isIndexActive;

    const theList = indexes.map(letter => {
      const active = classNames("waves-effect waves-light", {
        active: isIndexActive(activeIndex, letter),
      });

      const anchor = "#" + FAKED_PREFIX + letter;

      // Render
      return (
        <li
          key={letter}
          className={active}
          onClick={setIndex.bind(null, letter)}
        >
          <a href={anchor}>{letter}</a>
        </li>
      );
    });

    // Render
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <ul className="left hide-on-med-and-down">{theList}</ul>
          </div>
        </nav>

        <div
          className="fixed-action-btn click-to-toggle"
          style={{bottom: "10vh"}}
        >
          <a className="btn-floating btn-large blue accent-4">
            <i className="fa fa-bars"></i>
          </a>
          <ul>{theList}</ul>
        </div>
      </div>
    );
  }
}

class ItemList extends React.Component {
  render() {
    const activeIndex = this.props.activeIndex;
    const setItem = this.props.setItem;
    const activeItem = this.props.activeItem;
    const isItemActive = this.props.isItemActive;
    const itemMapToIndex = this.props.itemMapToIndex;
    const getItemValue = this.props.getItemValue;
    const getItemRender = this.props.getItemRender;

    const fields = this.props.items.map(c => {
      const itemClass = classNames("chip", {
        "teal lighten-2 grey-text text-lighten-4": isItemActive(activeItem, c),
      });
      const tmpIndex = itemMapToIndex(c);

      if (tmpIndex == activeIndex) {
        const randomKey = randomId();
        const val = getItemValue(c);
        const item = getItemRender(c);

        return (
          <div key={randomKey} className={itemClass}>
            <span onClick={setItem.bind(null, val)}>{item}</span>
          </div>
        );
      }
    });

    const id = FAKED_PREFIX + activeIndex;
    return (
      <div>
        <h3 id={id}>{activeIndex}</h3>
        {fields}
        <div className="divider"></div>
      </div>
    );
  }
}

export default IndexBox;
