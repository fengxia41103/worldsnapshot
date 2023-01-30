import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";

import { Icon, ListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

const myStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 8px",
    textTransform: "none",
    width: "100%",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: "auto",
  },
  active: {
    color: theme.palette.primary.main,
    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: theme.palette.primary.main,
    },
  },
}));

const NavBarItem = (props) => {
  const { href, icon, title } = props;

  const classes = myStyles();

  const activeClassName = "underline";

  return (
    <ListItem className={classes.item} disableGutters>
      <NavLink
        to={href}
        className={({ isActive }) => (isActive ? activeClassName : undefined)}
      >
        {icon && <Icon className={classes.icon} size="20" />}
        <span className={classes.title}>{title}</span>
      </NavLink>
    </ListItem>
  );
};

NavBarItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
};

export default NavBarItem;
