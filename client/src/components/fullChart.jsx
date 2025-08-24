import React, { useContext, useEffect } from "react";
import Chart from "chart.js/auto";
import ethSign from "../img/ethSign.png";

import { CoinContext } from "../context/coin";

const FullChart = () => {
  const { allPrices, cleanupChart, chart, setChart, isLoading } =
    useContext(CoinContext);

  const numbers = [7, 30, 60, 90, 180, 365];

  const showChart = async (num) => {
    const myChart = document.getElementById("myChart");

    if (!myChart) return;

    const existingChart = Chart.getChart(myChart);
    if (existingChart) {
      existingChart.destroy();
    }

    const tempArray = allPrices["USD"].slice(0, num);
    const priceArray = tempArray.map((price) => price[1]);
    const dateArray = tempArray.map((price) => price[0]);

    if (chart) {
      chart.destroy();
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
            label: "price in USD",
            data: priceArray.reverse(),
            pointRadius: 1,
            borderWidth: 1,
          },
        ],
      },
    });
    setChart(newChart);
  };

  useEffect(() => {
    if (Object.keys(allPrices).length !== 0) {
      showChart(7);
    }
  }, [allPrices]);

  useEffect(() => {
    return () => {
      cleanupChart();

      // Also clean up any chart instance on the canvas
      const myChart = document.getElementById("myChart");
      if (myChart) {
        const existingChart = Chart.getChart(myChart);
        if (existingChart) {
          existingChart.destroy();
        }
      }
    };
  }, []);

  return (
    <div className="full-chart">
      {Object.keys(allPrices).length > 0 && !isLoading ? (
        <div className="chart-card">
          <div className="chart-days-radios">
            {numbers.map((number, i) => (
              <label className="radio" key={i}>
                <input
                  type="radio"
                  name="radio"
                  onClick={() => showChart(number)}
                />
                <span>{number === 365 ? "1y" : number + "d"}</span>
              </label>
            ))}
          </div>
          <canvas id="myChart"></canvas>
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

export default FullChart;
