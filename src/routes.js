import React from "react";
import { Navigate } from "react-router-dom";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import BusinessIcon from "@mui/icons-material/Business";
import CompareIcon from "@mui/icons-material/Compare";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SortIcon from "@mui/icons-material/Sort";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { NotFoundView } from "@fengxia41103/storybook";

import WorldBankIndicators from "@Components/wb/WorldBankIndicators";

import MainLayout from "@Layouts/MainLayout";

const navbar_items = [
  {
    href: "/dashboard",
    icon: <DashboardIcon />,
    title: "Today",
  },
  {
    href: "/trending",
    icon: <TrendingUpIcon />,
    title: "Price Trending",
  },
  {
    href: "/stocks",
    icon: <BusinessIcon />,
    title: "My Stocks",
  },
  {
    href: "/sectors",
    icon: <CompareIcon />,
    title: "My Sectors",
  },
  {
    href: "/rankings",
    icon: <SortIcon />,
    title: "Stock Rankings",
  },
  {
    href: "/notes",
    icon: <EventNoteIcon />,
    title: "My Notes",
  },
  {
    href: "/news",
    icon: <AnnouncementIcon />,
    title: "News",
  },
];

const routes = [
  // application specific
  {
    path: "/",
    element: <MainLayout sideNavs={navbar_items} />,
    children: [
      { path: "/wb", element: <WorldBankIndicators /> },

      // landing page, default to dashboard
      { path: "/", element: <Navigate to="/wb" /> },
    ],
  },

  // catch all, 404
  { path: "*", element: <Navigate to="/404" /> },
];

export default routes;
