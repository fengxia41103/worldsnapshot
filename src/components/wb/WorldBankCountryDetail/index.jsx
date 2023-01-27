import { isUndefined } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

import { GlossaryDT } from "@fengxia41103/storybook";

import WorldBankGraph from "@Components/wb/WorldBankGraph";

const DEFAULT_INDICATORS = [
  {
    title: "GNI per capita, Atlas method (current US$)",
    indicator: "NY.GNP.PCAP.CD",
    type: "bar",
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
];

const WorldBankCountryDetail = () => {
  const { countryCode = "USA" } = useParams();
  const indicators = useSelector((state) => state.wb.indicators);

  if (indicators.length === 0) return null;

  const graphs = DEFAULT_INDICATORS.map((x) => {
    const { indicator } = x;

    const [indicatorDetail] = indicators.filter((i) => i.id === indicator);

    // TODO: true when we give it an invalid indicator
    if (isUndefined(indicatorDetail)) return null;

    const { name, description = "" } = indicatorDetail;

    return (
      <Card key={indicator}>
        <CardHeader
          title={<GlossaryDT term={name} description={description} />}
        />
        <CardContent>
          <WorldBankGraph {...{ countryCode, indicator }} />
        </CardContent>
      </Card>
    );
  });

  return <>{graphs}</>;
};

export default WorldBankCountryDetail;
