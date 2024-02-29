const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config("./config.env");

exports.displayCode = catchAsync(async (req, res) => {
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getCode",
      params: ["0xB39C5f2B2A71e46399C22a969DdE4726Eee56E8A", "0x10115AA"],
    }),
  };

  const response = await fetch(
    "https://opbnb-mainnet.nodereal.io/v1/8947c5b257744b50848842f1e4c4cd1c",
    options
  );

  if (!response) {
    return new appError("error fetching the code of the contract", 404);
  }
  const code = await response.json();
  console.log(code);
  res.status(200).json({
    status: "success",
    data: code,
  });
});
