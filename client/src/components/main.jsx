import React, { useCallback, useContext, useEffect, useState } from "react";
import ethSign from "../img/ethSign.png";
import { CoinContext } from "../context/coin";
import Chart from "chart.js/auto";
import { currencyArr } from "../currency";
import { coins } from "../consts";
import { useLocation } from "react-router-dom";

const Main = () => {
  const {
    currCoin,
    coinObj,
    currentCurrency,
    volumeOrMarketCap,
    openCurrencySelect,
    chooseCurrency,
    changeVolumeOrMarketCap,
    allPrices,
    chart,
    setChart,
    isLoading,
    cleanupChart,
  } = useContext(CoinContext);

  const numbers = [7, 30, 180, 365];

  const showChart = (currency, num) => {
    const myChart = document.getElementById("myChart");

    if (!myChart) return;

    const tempArray = allPrices[currency].slice(0, num);
    const priceArray = tempArray.map((price) => price[1]);
    const dateArray = tempArray.map((price) => price[0]);

    function getGradient(ctx, chartArea) {
      let gradient;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top,
      );
      gradient.addColorStop(1, "rgb(40, 57, 218)");
      gradient.addColorStop(0.5, "rgba(131, 58, 180, 1)");
      gradient.addColorStop(0, "rgba(253, 29, 29, 1)");
      return gradient;
    }

    if (chart) {
      chart.destroy();
    }

    const existingChart = Chart.getChart(myChart);
    if (existingChart) {
      existingChart.destroy();
    }

    const newChart = new Chart(myChart, {
      type: "line",
      data: {
        labels: dateArray
          .map((date, i) =>
            i === 0 ? "Today" : i === 1 ? "Yesterday" : date.split(",")[0],
          )
          .reverse(),
        datasets: [
          {
            data: priceArray.reverse(),
            label: `price in ${currency}`,
            pointRadius: 1,
            borderWidth: 1,
            borderColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return;
              }
              return getGradient(ctx, chartArea);
            },
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          title: {
            display: true,
            text: `Last ${
              num === 7
                ? "week"
                : num === 30
                  ? "month"
                  : num === 365
                    ? "year"
                    : num + " days"
            } changes`,
          },
        },
        scales: {
          y: {
            display: false,
            position: "right",
            grid: {
              display: false,
            },
          },
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
    setChart(newChart);
  };

  useEffect(() => {
    const myChart = document.getElementById("myChart");

    if (myChart && Object.keys(allPrices).length !== 0) {
      showChart("USD", 7);
    }
  }, [allPrices]);

  useEffect(() => {
    return () => {
      cleanupChart();

      const myChart = document.getElementById("`myChart");
      if (myChart) {
        const existingChart = Chart.getChart(myChart);
        if (existingChart) {
          existingChart.destroy();
        }
      }
    };
  }, []);

  return (
    <div className="main">
      {Object.keys(coinObj).length > 0 && !isLoading ? (
        <div className="card">
          <div className="card-header">
            <span className="name">{coins[currCoin].symbol}</span>

            <section className="dots-container" onClick={openCurrencySelect}>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </section>

            <div className="select-convertTo" id="select-convertTo">
              {currencyArr.map((currency, i) => (
                <span
                  key={i}
                  className="option-convertTo"
                  onClick={() => {
                    chooseCurrency(currency);
                  }}
                >
                  {currency}
                </span>
              ))}
            </div>
          </div>

          <div className="body">
            <div className="eth-price">
              <span>
                {currentCurrency
                  ? currentCurrency.name !== "BTC"
                    ? currentCurrency.symbol +
                      parseFloat(
                        currentCurrency.price.toFixed(2),
                      ).toLocaleString() +
                      " " +
                      currentCurrency.name
                    : currentCurrency.symbol +
                      currentCurrency.price.toFixed(5) +
                      " " +
                      currentCurrency.name
                  : coinObj.USD?.symbol +
                    parseFloat(coinObj.USD?.price.toFixed(2)).toLocaleString() +
                    " " +
                    coinObj.USD?.name}
              </span>
              <span
                className="price-change"
                id={
                  coinObj.USD?.percent_change_24h > 0 ? "positive" : "negative"
                }
              >
                <span
                  className={
                    coinObj.USD?.percent_change_24h > 0
                      ? "arrow-up"
                      : "arrow-down"
                  }
                />{" "}
                {currentCurrency
                  ? Math.abs(currentCurrency.percent_change_24h).toFixed(2)
                  : Math.abs(coinObj.USD?.percent_change_24h).toFixed(2)}
                %
              </span>
            </div>
            <canvas id="myChart"></canvas>
            <div className="chart-days-container">
              {numbers.map((num, i) => (
                <label className="chart-day" key={i}>
                  <input
                    type="radio"
                    name="radio"
                    onClick={() => showChart("USD", num)}
                    defaultChecked={num === 7}
                  />
                  <span>{num === 365 ? "1Y" : num + "D"}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="footer">
            <div className="eth-volume">
              <select
                id="show-in-fotter"
                onChange={(e) => changeVolumeOrMarketCap(e.target.value)}
              >
                <option value="volume_24h">24HR VOLUME</option>
                <option value="market_cap">MARKET CAP</option>
              </select>
              <br />
              <span style={{ color: "white", fontSize: 14 }}>
                {currentCurrency
                  ? currentCurrency.symbol +
                    parseFloat(
                      currentCurrency[volumeOrMarketCap].toFixed(2),
                    ).toLocaleString() +
                    " " +
                    currentCurrency.name
                  : coinObj.USD?.symbol +
                    parseFloat(
                      coinObj.USD?.[volumeOrMarketCap].toFixed(2),
                    ).toLocaleString() +
                    " " +
                    coinObj.USD?.name}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <div className="loader-in">
            <img
              src={ethSign}
              alt="Coin-SIGN"
              style={{ width: 50, height: 100 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
