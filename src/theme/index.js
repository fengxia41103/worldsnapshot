import { colors } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

import shadows from "./shadows";
import typography from "./typography";

const theme = responsiveFontSizes(
  createTheme({
    spacing: 3,
    palette: {
      background: {
        dark: "#F4F6F8",
        default: colors.common.white,
        paper: colors.common.white,
      },
      primary: {
        main: colors.indigo[500],
      },
      secondary: {
        main: "#d52349",
        contrastText: colors.common.white,
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows,
    typography,
    table: {
      minWidth: 650,
    },
  }),
);

export default theme;
