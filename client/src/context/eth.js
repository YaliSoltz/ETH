import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { currencyArr } from "../currency";

export const EthContext = createContext();

const EthProvider = ({ children }) => {
  const [eth, setEth] = useState({}); // The ETH obj
  const [currentCurrency, setCurrentCurrency] = useState(); // The current currency to display
  const [volumeOrMarketCap, setVolumeOrMarketCap] = useState("volume_24h"); // Choose what to display at the market-cap / 24hour volume select
  const [allPrices, setAllPrices] = useState({}); // Object of arraies of last 365 days ETH price and date in USD/EUR/BTC
  const [chart, setChart] = useState(false);

  // Func that show the currencies options
  const openCurrencySelect = () => {
    const select = document.getElementById("select-convertTo");
    select.style.display === "flex"
      ? (select.style.display = "none")
      : (select.style.display = "flex");
  };

  // Func that get a key (USD/EUR/BTC) and set the currentCurrency with eth.key
  const chooseCurrency = (key) => {
    const select = document.getElementById("select-convertTo");
    select.style.display = "none";
    console.log(eth[key]);
    setCurrentCurrency({ ...eth[key] });
  };

  // Func that change the market-cap / 24hour volume select
  const changeVolumeOrMarketCap = (value) => {
    setVolumeOrMarketCap(value);
  };

  // Func that get the ETH obj from the server and set it
  const getEth = async () => {
    const url = "http://localhost:4000/api/eth/";
    const { data } = await axios.get(url);
    console.log(data);

    const { last_updated } = data;
    setEth({ ...data });
    let priceObj = {};
    currencyArr.map((currency) => (priceObj[currency] = data[currency].price));
    getEthPrices(
      last_updated,

      priceObj
    );
  };

  // Func that get the last 365 days ETH price and date
  const getEthPrices = async (date, priceObj) => {
    let obj = {};
    for (let i = 0; i < currencyArr.length; i++) {
      const currency = currencyArr[i];
      const url = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${currency}&days=365`;
      const { data } = await axios.get(url);

      // Sort the array by date
      let tempArray = data.prices.sort((a, b) => b[0] - a[0]);
      tempArray.splice(0, 2, [date, priceObj[currency]]);

      // Convert the Unix timestamp value to a human-readable date and time
      tempArray.forEach((price) => {
        price[0] = new Date(price[0]).toLocaleString();
        if (currency !== "BTC") price[1] = price[1].toFixed(2);
      });
      obj[currency] = tempArray;
    }
    console.log(obj);
    setAllPrices({ ...obj });
  };

  // useEffect func to run getEth and getEthPrices functions on component mount and run them every minute for updating the eth price
  useEffect(() => {
    const intervalId = setInterval(() => {
      getEth();
    }, 1000 * 60);
    getEth();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <EthContext.Provider
      value={{
        eth,
        setEth,
        currentCurrency,
        setCurrentCurrency,
        volumeOrMarketCap,
        setVolumeOrMarketCap,
        allPrices,
        setAllPrices,
        openCurrencySelect,
        chooseCurrency,
        changeVolumeOrMarketCap,
        chart,
        setChart,
      }}
    >
      {children}
    </EthContext.Provider>
  );
};

export default EthProvider;
