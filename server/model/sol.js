const { Schema, model } = require("mongoose");

// SOL mongoose schema
const schema = new Schema({
  USD: {
    price: Number,
    volume_24h: Number,
    market_cap: Number,
    volume_change_24h: Number,
    percent_change_1h: Number,
    percent_change_24h: Number,
    percent_change_7d: Number,
    percent_change_30d: Number,
    percent_change_60d: Number,
    percent_change_90d: Number,
  },
  EUR: {
    price: Number,
    volume_24h: Number,
    market_cap: Number,
    volume_change_24h: Number,
    percent_change_1h: Number,
    percent_change_24h: Number,
    percent_change_7d: Number,
    percent_change_30d: Number,
    percent_change_60d: Number,
    percent_change_90d: Number,
  },
  BTC: {
    price: Number,
    volume_24h: Number,
    market_cap: Number,
    volume_change_24h: Number,
    percent_change_1h: Number,
    percent_change_24h: Number,
    percent_change_7d: Number,
    percent_change_30d: Number,
    percent_change_60d: Number,
    percent_change_90d: Number,
  },
  time: { type: String, default: () => new Date().toLocaleString() },
  last_updated: String,
});

const SOL = model("SOL", schema);

module.exports = { SOL };
