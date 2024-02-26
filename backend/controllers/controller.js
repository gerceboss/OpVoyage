const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config("./config.env");

exports.latestBlock = catchAsync(async (req, res) => {
  //fetching block number
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method: "eth_blockNumber" }),
  };

  fetch(
    "https://opbnb-mainnet.nodereal.io/v1/8947c5b257744b50848842f1e4c4cd1c",
    options
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  res.status(200).json({
    status: "success",
  });
});

exports.latestBlockByNumber = catchAsync(async (req, res, next) => {
  sdk.ethGetBlockByNumber(
    {
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [""],
    },
    {
      apiKey: process.env.api_key,
    }
  );
});
