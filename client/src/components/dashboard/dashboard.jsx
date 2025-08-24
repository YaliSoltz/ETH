import React, { useState, useEffect, useRef } from "react";
import * as Chart from "chart.js";
import "./dashboard.css";
import { useClock } from "../../hooks/useClock";

const Dashboard = () => {
  const chartRef = useRef(null);

  const coinData = {
    solana: {
      symbol: "SOL",
      full_name: "Solana",
      name: "solana",
      description:
        "High-performance blockchain with fast transactions and low fees.",
    },
    ethereum: {
      symbol: "ETH",
      full_name: "Ethereum",
      name: "ethereum",
      description:
        "Leading programmable blockchain for decentralized applications.",
    },
    gold: {
      symbol: "XAU",
      full_name: "Gold",
      name: "gold",
      description:
        "Precious metal and historic store of value against inflation.",
    },
    usd: {
      symbol: "USD",
      full_name: "US Dollar",
      name: "usd",
      description:
        "World's primary reserve currency for international transactions.",
    },
  };
  const [marketData, setMarketData] = useState(null);
  const [selectedBase, setSelectedBase] = useState("usd");
  const [loading, setLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const time = useClock();

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const cryptoResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum,usd&vs_currencies=usd,eth,sol,xau&x_cg_demo_api_key=${process.env.REACT_APP_CRYPTO_API_KEY}`,
      );
      const cryptoData = await cryptoResponse.json();

      const newMarketData = {
        solana: {
          ...coinData.solana,
          rates: {
            usd: cryptoData.solana.usd,
            ethereum: cryptoData.solana.eth,
            gold: cryptoData.solana.xau,
            solana: 1,
          },
        },
        ethereum: {
          ...coinData.ethereum,
          rates: {
            usd: cryptoData.ethereum.usd,
            solana: cryptoData.ethereum.sol,
            gold: cryptoData.ethereum.xau,
            ethereum: 1,
          },
        },
        gold: {
          ...coinData.gold,
          rates: {
            usd: 1 / cryptoData.usd.xau,
            solana: 1 / cryptoData.solana.xau,
            ethereum: 1 / cryptoData.ethereum.xau,
            gold: 1,
          },
        },
        usd: {
          ...coinData.usd,
          rates: {
            solana: cryptoData.usd.sol,
            ethereum: cryptoData.usd.eth,
            gold: cryptoData.usd.xau,
            usd: 1,
          },
        },
      };

      setMarketData(newMarketData);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.LineElement,
      Chart.PointElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
    );
    return () => {
      if (chartRef.current) {
        Chart.Chart.getChart(chartRef.current)?.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!marketData) return;
    if (!chartRef.current) return;
    const existingChart = Chart.Chart.getChart(chartRef.current);
    if (existingChart) existingChart.destroy();

    const ctx = chartRef.current.getContext("2d");

    const chartData = { labels: [], data: [] };

    Object.entries(marketData)
      .filter(([, item]) => item.name !== selectedBase)
      .map(([, item], index) => {
        chartData.labels.push(
          `${item.symbol}/${marketData[selectedBase].symbol}`,
        );
        chartData.data.push(item.rates[selectedBase]);
      });

    const colorMap = ["#FFD700", "#FF6B9D", "#DAA520"];
    new Chart.Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: `Relative to ${selectedBase}`,
            data: chartData.data,
            backgroundColor: colorMap,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [selectedBase, marketData]);

  return (
    <div className="dashboard">
      <div className="clock">
        Time: {time.toLocaleTimeString()} Last updated:{" "}
        {lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : "Loading..."}
      </div>
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="title">Market Overview</h1>
            <div className="subtitle">
              <div className="accent-line" />
              <span>Values shown in {marketData?.[selectedBase]?.symbol}</span>
            </div>
          </div>
          <div>
            <h3 className="selector-label">Base Currency</h3>
            <div className="currency-buttons">
              {marketData &&
                Object.entries(marketData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBase(key)}
                    className={`currency-btn ${selectedBase === key ? "selected" : ""}`}
                  >
                    {data.symbol}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </header>
      <div className="main-content">
        <div className="price-cards">
          {marketData &&
            Object.entries(marketData).map(([, data], index) => (
              <div key={data.symbol} className="price-card">
                <div className="card-overlay" />
                <div className="card-content">
                  <div className="card-header">
                    <span className="symbol">{data.symbol}</span>
                    <div
                      className={`accent-line ${index % 2 === 0 ? "gold" : "wine"}`}
                    />
                  </div>
                  <div className={`price ${loading ? "loading" : ""}`}>
                    {loading ? "---" : data.rates[selectedBase].toFixed(2)}
                  </div>
                  <div className="card-expanded-info">
                    <h4 className="currency-name">{data.full_name}</h4>
                    <p className="currency-description">{data.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div>
          <div className="chart-container">
            <div className="chart-title">
              <div className="title-accent-line" />
              <h3 className="title-text">
                Relative Performance ({marketData?.[selectedBase]?.symbol})
              </h3>
            </div>
            <div className="chart-wrapper">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
