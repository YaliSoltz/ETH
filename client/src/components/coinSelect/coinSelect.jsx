import React, { useContext } from "react";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./coinSelect.css";
import { Link } from "react-router-dom";
import { coins } from "../../consts";
import { CoinContext } from "../../context/coin";

const CoinSelect = () => {
  const { currCoin, setCurrCoin } = useContext(CoinContext);
  return (
    <div className={"coins-select"}>
      {Object.keys(coins).map((coin, i) => (
        <div
          onClick={() => setCurrCoin(coin)}
          key={i}
          className={`coin-btn${currCoin === coin ? " selected" : ""}`}
        >
          {coin}
        </div>
      ))}
    </div>
  );
};

export default CoinSelect;
