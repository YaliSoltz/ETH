const { Router } = require("express");
const axios = require("axios");
const router = Router();
const { ETH } = require("../model/eth");
const { SOL } = require("../model/sol");

const coins = {
  eth: {
    name: "ethereum",
    symbol: "ETH",
    schema: ETH,
  },
  sol: {
    name: "solana",
    symbol: "SOL",
    schema: SOL,
  },
};

// Get Coin
router.get("/:coin", async (req, res) => {
  // Array of all the Coin currencies
  const currencyArr = [
    ["USD", "$"],
    ["EUR", "€"],
    ["BTC", "₿"],
    ["ILS", "₪"],
  ];

  // Coin obj
  let objCoin = {};

  // Coin Api url
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${req.params.coin}&convert=`;

  // My API key for the api
  const headers = {
    "X-CMC_PRO_API_KEY": "92644239-8cbd-47fa-b5d7-7b0ab1d60a9a",
  };

  // Loop that get all the Coin data for each currency and set them into objCoin object
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
      } = data.data[coins[req.params.coin].symbol].quote[currency];
      if (!objCoin.last_updated) {
        objCoin.last_updated = new Date(last_updated).toLocaleString();
      }

      objCoin[currency] = {
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

  res.status(200).send(objCoin);
  try {
    let coinToSave = new coins[req.params.coin].schema(objCoin);
    coinToSave = await coinToSave.save();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete all
router.delete("/:coin", async (req, res) => {
  await coins[req.params.coin].schema.deleteMany();
  res.send("All deleted");
});

module.exports = router;
