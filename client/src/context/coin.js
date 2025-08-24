import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { currencyArr } from "../currency";
import { coins } from "../consts";

export const CoinContext = createContext();

const CoinProvider = ({ children }) => {
  const [currCoin, setCurrCoin] = useState("sol"); // Setting the coin
  const [coinObj, setCoinObj] = useState({}); // The coin obj
  const [currentCurrency, setCurrentCurrency] = useState(); // The current currency to display
  const [volumeOrMarketCap, setVolumeOrMarketCap] = useState("volume_24h"); // Choose what to display at the market-cap / 24hour volume select
  const [allPrices, setAllPrices] = useState({}); // Object of arraies of last 365 days ETH price and date in USD/EUR/BTC
  const [chart, setChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cleanupChart = () => {
    if (chart) {
      chart.destroy();
      setChart(null);
    }
  };

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
    console.log(coinObj[key]);
    setCurrentCurrency({ ...coinObj[key] });
  };

  // Func that change the market-cap / 24hour volume select
  const changeVolumeOrMarketCap = (value) => {
    setVolumeOrMarketCap(value);
  };

  // Func that get the coin obj from the server and set it
  const getCoinObj = async () => {
    //     const url = `http://localhost:4000/api/${currCoin}`; // Node version
    const url = `http://localhost:8000/api/${currCoin}`; // Fast Api version

    try {
      setIsLoading(true);
      const { data } = await axios.get(url);

      const { last_updated } = data;
      setCoinObj({ ...data });
      let priceObj = {};
      currencyArr.map(
        (currency) => (priceObj[currency] = data[currency].price),
      );
      getCoinPrices(last_updated, priceObj);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Func that get the last 365 days coin price and date
  const getCoinPrices = async (date, priceObj) => {
    let obj = {};
    setIsLoading(true);
    for (let i = 0; i < currencyArr.length; i++) {
      const currency = currencyArr[i];
      const url = `https://api.coingecko.com/api/v3/coins/${coins[currCoin].name}/market_chart?vs_currency=${currency}&days=365&x_cg_demo_api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`;
      try {
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
      } catch (error) {
        console.error(`Error fetching ${currency} prices:`, error);
      }

      setIsLoading(false);
    }

    setAllPrices({ ...obj });
  };

  // useEffect func to run getCoinObj and getCoinPrices functions on component mount and run them every minute for updating the eth price
  useEffect(() => {
    const intervalId = setInterval(() => {
      getCoinObj();
    }, 1000 * 60);
    getCoinObj();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    cleanupChart();
    getCoinObj();
  }, [currCoin]);

  return (
    <CoinContext.Provider
      value={{
        coinObj,
        setCoinObj,
        currentCurrency,
        setCurrentCurrency,
        volumeOrMarketCap,
        setVolumeOrMarketCap,
        allPrices,
        setAllPrices,
        currCoin,
        setCurrCoin,
        openCurrencySelect,
        chooseCurrency,
        changeVolumeOrMarketCap,
        chart,
        setChart,
        cleanupChart,
        isLoading,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export default CoinProvider;
