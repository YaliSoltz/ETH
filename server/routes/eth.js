const { Router } = require("express");
const axios = require("axios");
const { ETH } = require("../model/eth");
const router = Router();

// Get ETH
router.get("/", async (req, res) => {
  // Array of all the ETH currencies
  const currencyArr = [
    ["USD", "$"],
    ["EUR", "€"],
    ["BTC", "₿"],
  ];

  // ETH obj
  let objETH = {};

  // ETH Api url
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=";

  // My API key for the api
  const headers = {
    "X-CMC_PRO_API_KEY": "92644239-8cbd-47fa-b5d7-7b0ab1d60a9a",
  };

  // Loop that get all the ETH data for each currency and set them into objETH object
  for (let i = 0; i < currencyArr.length; i++) {
    try {
      const { data } = await axios.get(url + currencyArr[i][0], { headers });

      // The currency name: USD/EUR/BTC
      const currency = currencyArr[i][0];

      // The currency symbol
      const symbol = currencyArr[i][1];

      const {
        price,
        market_cap,
        volume_24h,
        volume_change_24h,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
        percent_change_30d,
        percent_change_60d,
        percent_change_90d,
        last_updated,
      } = data.data.ETH.quote[currency];

      if (!objETH.last_updated) {
        objETH.last_updated = new Date(last_updated).toLocaleString();
      }

      objETH[currency] = {
        name: currency,
        symbol,
        price,
        market_cap,
        volume_24h,
        volume_change_24h,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
        percent_change_30d,
        percent_change_60d,
        percent_change_90d,
      };
    } catch (error) {
      console.log(error.message);
      return res.status(400).send(error.message);
    }
  }

  try {
    let eth = new ETH(objETH);
    eth = await eth.save();
    res.status(200).send(objETH);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete all
router.delete("/", async (req, res) => {
  await ETH.deleteMany();
  res.send("All deleted");
});

module.exports = router;
