const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const coin = require("./routes/coin");

const app = express();
const port = 4000;

// connection to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/eth-test")
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB failed to connect"));

app.use(express.json());
app.use(cors());
app.use("/api/", coin);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
