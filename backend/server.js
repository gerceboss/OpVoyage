const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const blockRouter = require("./routes/blockRouter");
const txRouter = require("./routes/txRouter");

dotenv.config({ path: "./config" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/blocks", blockRouter);
app.use("/api/txs", txRouter);

const port = 5000;

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
  //
});
