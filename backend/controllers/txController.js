//tasks
// 1. fetch latest tx and store in db with timestamp and all details you can get
// 2. make a function to retrive a block using tx id  => txModel should have ref to the block it is in either to the nnumber or thee mongodb object id
// 3. make a function to gte all the txs in the db
// 4. make a function to fetch one tx using its id

const Transaction = require("../models/txModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
dotenv.config("./config.env");
const apiURL = process.env.API;
//1 ?? dunno how to do
//2
exports.getTxByHash = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    transactionHash: req.params.txhash,
  });
  if (transaction) {
    res.status(200).json({
      status: "sucess",
      data: transaction,
    });
  } else {
    return appError("No such transaction found!", 404);
  }
});

exports.getAllTxs = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({});
  if (transactions) {
    res.status(200).json({
      status: "success",
      data: transactions,
    });
  } else {
    return appError("No transaction exists in the db", 404);
  }
});

exports.saveTxs = catchAsync(async (txs) => {
  for (let i in txs) {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        method: "eth_getTransactionReceipt",
        params: [`${txs[i]}`],
        id: 1,
        jsonrpc: "2.0",
      }),
    };
    const response = await fetch(apiURL, options);
    let txReceipt = await response.json();
    txReceipt = txReceipt.result;

    //modify the body according to the data required;
    const txFinal = await Transaction.create({
      blockHash: txReceipt.blockHash,
      blockNumber: txReceipt.blockNumber,
      transactionIndex: txReceipt.transactionIndex,
      transactionHash: txReceipt.transactionHash,
      from: txReceipt.from,
      to: txReceipt.to,
      gasUsed: txReceipt.gasUsed,
      contractAddress: txReceipt.contractAddress,
    });
  }
  return "success";
});
