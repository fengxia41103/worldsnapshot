import classNames from "classnames";
import _ from "lodash";
import React from "react";

import { randomId } from "./helper.jsx";
import ProgressBox from "./progress.jsx";

class IFrameBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };

    //binding
    this._iframeOnLoad = this._iframeOnLoad.bind(this);
  }

  _iframeOnLoad() {
    this.setState({
      loaded: true,
    });
  }

  render() {
    const style = {
      height: "100vh",
      width: "100%",
    };
    return (
      <div>
        {!this.state.loaded ? <ProgressBox /> : null}
        <iframe
          src={this.props.src}
          frameBorder="0"
          scrolling="no"
          seamless="true"
          onLoad={this._iframeOnLoad}
          style={style}
        />
      </div>
    );
  }
}

class WordcloudBox extends React.Component {
  render() {
    const countryName = this.props.activeCountry.name.toLowerCase();
    const src =
      "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" +
      countryName +
      "&output=wordcloud&outputtype=english";

    // Render content
    return (
      <div>
        <h3>{this.props.activeCountry.iso2Code}</h3>
        <figure>
          <figcaption>
            GDELT the most popular theme in the last 24 hours
          </figcaption>

          <IFrameBox src={src} />
        </figure>
      </div>
    );
  }
}

class NewsImageBox extends React.Component {
  render() {
    const src =
      "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" +
      this.props.activeCountry.name +
      "&output=artimgonlycollage&outputtype=theme";

    // Render content
    return (
      <div>
        <h3>{this.props.activeCountry.iso2Code} news</h3>
        <IFrameBox src={src} />
      </div>
    );
  }
}

class ToneTimelineBox extends React.Component {
  render() {
    const src =
      "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query=" +
      this.props.activeCountry.name +
      "&output=timeline&outputtype=tone";

    // Render content
    return (
      <div>
        <h3>{this.props.activeCountry.iso2Code}</h3>
        <figure style={{ minHeight: "500px" }}>
          <figcaption>GDELT tone timeline</figcaption>
          <IFrameBox src={src} />
        </figure>
      </div>
    );
  }
}

class GDELTBox extends React.Component {
  render() {
    const countries = _.sortBy(this.props.activeItem, "iso2Code");
    const clouds = countries.map((c) => {
      return (
        <div key={randomId()}>
          <div className="row">
            <div className="col s8">
              <WordcloudBox key={c.name} activeCountry={c} />
            </div>
            <div className="col s4">
              <NewsImageBox key={c.name} activeCountry={c} />
            </div>
          </div>
          <div className="divider"></div>

          <ToneTimelineBox key={c.name} activeCountry={c} />
        </div>
      );
    });

    return (
      <div>
        {clouds}
        <div className="divider"></div>
      </div>
    );
  }
}

export default GDELTBox;
