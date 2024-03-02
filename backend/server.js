const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const blockRouter = require("./routes/blockRouter");
const txRouter = require("./routes/txRouter");
const eventRouter = require("./routes/eventRouter");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/blocks", blockRouter);
app.use("/api/txs", txRouter);
app.use("/api/events", eventRouter);
const port = 5000;

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});
