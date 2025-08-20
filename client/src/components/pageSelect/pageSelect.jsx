import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./pageSelect.css";
import { Link, useLocation } from "react-router-dom";

const PageSelect = () => {
  const { pathname } = useLocation();
  const pages = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Full Chart", path: "/full-chart", icon: <BarChartIcon /> },
  ];

  return (
    <div className={"page-select"}>
      {pages.map((page, i) => (
        <Link
          key={i}
          to={page.path}
          className={`page-link${pathname === page.path ? " selected" : ""}`}
        >
          <div className={"icon"}> {page.icon}</div>
          {page.name}
        </Link>
      ))}
    </div>
  );
};

export default PageSelect;
