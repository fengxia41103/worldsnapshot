import classNames from "classnames";
import d3plus from "d3plus";
import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";

import AjaxContainer from "./ajax.jsx";
import CountryBox from "./country.jsx";
import DhsGraphContainer from "./dhs-graph.jsx";
import GDELTBox from "./gdelt.jsx";
import { randomId } from "./helper.jsx";
import WbGraphContainer from "./wb-graph.jsx";
import WbIndicators from "./wb-indicator.jsx";

class RootBox extends React.Component {
  constructor(props) {
    super(props);

    this.graphsInDisplay = [];
    this.state = {
      countryCode: [],
      indicators: [],
      graphs: [
        /* {
         *   title:
         *     "Age-specific fertility rate for the three years preceding the survey, expressed per 1,000 women",
         *   indicators: [
         *     "FE_FRTR_W_A15",
         *     "FE_FRTR_W_A20",
         *     "FE_FRTR_W_A25",
         *     "FE_FRTR_W_A30",
         *     "FE_FRTR_W_A35",
         *     "FE_FRTR_W_A40",
         *     "FE_FRTR_W_A45",
         *   ],
         *   type: "bar",
         *   source: "dhs",
         * },
         * {
         *   title: "HIV prevalence among couples",
         *   indicators: [
         *     "HA_HPAC_B_CPP",
         *     "HA_HPAC_B_CPN",
         *     "HA_HPAC_B_CNP",
         *     "HA_HPAC_B_CNN",
         *   ],
         *   type: "pie",
         *   source: "dhs",
         * }, */
        {
          title: "GNI per capita, Atlas method (current US$)",
          indicator: "NY.GNP.PCAP.CD",
          type: "bar",
          source: "wb",
        },
        {
          title: "GDP per person employed (constant 2011 PPP $)",
          indicator: "SL.GDP.PCAP.EM.KD",
          source: "wb",
        },
        {
          title: "Labor force, total",
          indicator: "SL.TLF.TOTL.IN",
          source: "wb",
        },
        {
          title: "Life expectancy at birth, total (years)",
          indicator: "SP.DYN.LE00.IN",
          source: "wb",
        },
        {
          title: "Inflation, GDP deflator (annual %)",
          indicator: "NY.GDP.DEFL.KD.ZG",
          type: "bar",
          source: "wb",
        },
        {
          title: "Inflation, consumer prices (annual %)",
          indicator: "FP.CPI.TOTL.ZG",
          type: "bar",
          source: "wb",
        },
        {
          title: "Real interest rate (%)",
          indicator: "FR.INR.RINR",
          source: "wb",
        },
        {
          title: "Fertility rate, total (births per woman)",
          indicator: "SP.DYN.TFRT.IN",
          source: "wb",
        },
        {
          title: "Population ages 0-14 (% of total)",
          indicator: "SP.POP.0014.TO.ZS",
          type: "line",
          source: "wb",
        },
        {
          title: "Population ages 15-64 (% of total)",
          indicator: "SP.POP.1564.TO.ZS",
          type: "line",
          source: "wb",
        },
        {
          title: "Health expenditure, total (% of GDP)",
          indicator: "SH.XPD.TOTL.ZS",
          type: "bar",
          source: "wb",
        },
        {
          title: "Health expenditure per capita (current US$)",
          indicator: "SH.XPD.PCAP",
          type: "bar",
          source: "wb",
        },
        {
          title: "Rural population (% of total population)",
          indicator: "SP.RUR.TOTL.ZS",
          source: "wb",
        },
        {
          title: "Urban population (% of total)",
          indicator: "SP.URB.TOTL.IN.ZS",
          source: "wb",
        },
        {
          title: "Population living in slums, (% of urban population)",
          indicator: "EN.POP.SLUM.UR.ZS",
          type: "bar",
          source: "wb",
        },
        {
          title: "Revenue, excluding grants (% of GDP)",
          indicator: "GC.REV.XGRT.GD.ZS",
          source: "wb",
        },
        {
          title:
            "External debt stocks, public and publicly guaranteed (PPG) (DOD, current US$)",
          indicator: "DT.DOD.DPPG.CD",
          source: "wb",
        },
        {
          title: "Bank nonperforming loans to total gross loans (%)",
          indicator: "FB.AST.NPER.ZS",
          type: "bar",
          source: "wb",
        },
        {
          title: "Bank capital to assets ratio (%)",
          indicator: "FB.BNK.CAPA.ZS",
          source: "wb",
        },
        {
          title: "Broad money growth (annual %)",
          indicator: "FM.LBL.BMNY.ZG",
          source: "wb",
        },
        {
          title: "Net barter terms of trade index (2000 = 100)",
          indicator: "TT.PRI.MRCH.XD.WD",
          source: "wb",
        },
        {
          title: "Merchandise trade (% of GDP)",
          indicator: "TG.VAL.TOTL.GD.ZS",
          source: "wb",
        },
        {
          title: "Exports of goods and services (% of GDP)",
          indicator: "NE.EXP.GNFS.ZS",
          source: "wb",
        },
        {
          title: "Imports of goods and services (% of GDP)",
          indicator: "NE.IMP.GNFS.ZS",
          source: "wb",
        },
        {
          title: "Merchandise exports (current US$)",
          indicator: "TX.VAL.MRCH.CD.WT",
          source: "wb",
        },
        {
          title: "Merchandise imports (current US$)",
          indicator: "TM.VAL.MRCH.CD.WT",
          source: "wb",
        },
        {
          title: "High-technology exports (% of manufactured exports)",
          indicator: "TX.VAL.TECH.MF.ZS",
          source: "wb",
        },
        {
          title: "Foreign direct investment, net inflows (BoP, current US$)",
          indicator: "BX.KLT.DINV.CD.WD",
          source: "wb",
        },
        {
          title: "Stocks traded, total value (% of GDP)",
          indicator: "CM.MKT.TRAD.GD.ZS",
          source: "wb",
        },
        {
          title: "Stocks traded, turnover ratio of domestic shares (%)",
          indicator: "CM.MKT.TRNR",
          source: "wb",
        },
        {
          title: "Expense (% of GDP)",
          indicator: "GC.XPN.TOTL.GD.ZS",
          source: "wb",
        },
        {
          title: "Tax revenue (% of GDP)",
          indicator: "GC.TAX.TOTL.GD.ZS",
          source: "wb",
        },
        {
          title: "Patent applications, residents",
          indicator: "IP.PAT.RESD",
          source: "wb",
        },
        {
          title: "Patent applications, nonresidents",
          indicator: "IP.PAT.NRES",
          source: "wub",
        },
        {
          title: "Researchers in R&D (per million people)",
          indicator: "SP.POP.SCIE.RD.P6",
          source: "wb",
        },
        {
          title: "Scientific and technical journal articles",
          indicator: "IP.JRN.ARTC.SC",
          source: "wb",
        },
        {
          title: "Research and development expenditure (% of GDP)",
          indicator: "GB.XPD.RSDV.GD.ZS",
          source: "wb",
        },
        {
          title: "CO2 emissions (metric tons per capita)",
          indicator: "EN.ATM.CO2E.PC",
          source: "wb",
        },
        {
          title: "Energy use (kg of oil equivalent per capita)",
          indicator: "EG.USE.PCAP.KG.OE",
          source: "wb",
        },
        {
          title: "International tourism, expenditures (% of total imports)",
          indicator: "ST.INT.XPND.MP.ZS",
          source: "wb",
        },
        {
          title: "International tourism, receipts (% of total exports)",
          indicator: "ST.INT.RCPT.XP.ZS",
          source: "wb",
        },
      ],
      index: 0, // load more function starting index
    };

    //binding
    this.setCountry = this.setCountry.bind(this);
    this.handleIndicatorUpdate = this.handleIndicatorUpdate.bind(this);
    this._generateGraphs = this._generateGraphs.bind(this);
  }

  setCountry(code) {
    const existing = this.state.countryCode;

    // toggle it: if on the list, remove;
    // if not, add
    let modified = null;
    if (
      _.some(existing, (item) => {
        return item.iso2Code == code.iso2Code;
      })
    ) {
      modified = _.filter(existing, (item) => {
        return item.iso2Code != code.iso2Code;
      });
    } else {
      existing.push(code);
      modified = existing;
    }

    // Update country code selections
    // and re-initialize the graphs
    this.setState(
      {
        countryCode: modified,
        index: 0,
      },
      () => {
        this.graphsInDisplay = [];

        // Initial showing
        this._generateGraphs();
      },
    );
  }

  handleIndicatorUpdate(data) {
    // Acquired indicator list from data API
    this.setState({
      indicators: data[1].slice(0, 1),
    });

    // Extend pre-existing indicator list
    const tmp = this.state.graphs.slice();
    const indicators = data[1];
    for (let i = 0; i < indicators.length; i++) {
      tmp.push({
        title: indicators[i].name,
        indicator: indicators[i].id,
        source: "wb",
        sourceNote: indicators[i].sourceNote,
      });
    }
    this.setState({
      graphs: tmp,
    });
  }

  _generateGraphs() {
    // Show more step
    const step = 5;

    // We randomize bar charts and line charts, maintain a ratio of 4 lines to 1 bar.
    // Note: this requirement is completely arbitrary and is applicable only to
    // graphs which have no defined "type" in this.state.graphs.
    const graphTypes = _.shuffle(["line", "line", "line", "line", "bar"]);

    // Generate more graphs
    const code = _.map(this.state.countryCode, "iso2Code");
    const index = this.state.index;
    const total = this.state.graphs.length;
    const indexEnd = Math.min(index + step, total);

    const tmp = [];
    for (let i = index, j = 0; i < indexEnd; i++, j++) {
      const id = randomId("DHS");
      const g = this.state.graphs[i];
      let graphType = "";

      if (typeof g.type === "undefined") {
        graphType = graphTypes[j];
      } else {
        graphType = g.type;
      }

      if (g.source === "dhs") {
        tmp.push(
          <DhsGraphContainer
            key={id}
            countryCode={code}
            type={graphType}
            {...g}
          />,
        );
      } else if (g.source === "wb") {
        tmp.push(
          <WbGraphContainer
            key={id}
            countryCode={code}
            type={graphType}
            {...g}
          />,
        );
      }
    }

    // Add to graph in display
    this.graphsInDisplay = _.concat(this.graphsInDisplay, tmp);

    // Set up next starting index
    this.setState({
      index: indexEnd,
    });
  }

  render() {
    const loadWbIndicators =
      this.state.indicators.length < 1 ? (
        <WbIndicators handleUpdate={this.handleIndicatorUpdate} />
      ) : null;
    const haveMore =
      this.state.index > 0 && this.state.index < this.state.graphs.length ? (
        <div className="right-align">
          <span
            className="waves-effect waves-light btn"
            style={{ marginTop: "1em" }}
            onClick={this._generateGraphs}
          >
            Load more{" "}
          </span>{" "}
        </div>
      ) : null;

    return (
      <div className="container">
        <CountryBox
          setItem={this.setCountry}
          activeItem={this.state.countryCode}
        />

        {/* Load more WB indicators */}
        {loadWbIndicators}

        <article>
          {/* <GDELTBox
              activeItem={ this.state.countryCode } /> */}

          {/* graphs */}
          {this.graphsInDisplay}
          {haveMore}
        </article>
      </div>
    );
  }
}

export default RootBox;
