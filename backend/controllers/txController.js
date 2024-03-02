//tasks
// 1. fetch latest tx and store in db with timestamp and all details you can get
// 2. make a function to retrive a block using tx hash  => txModel should have ref to the block it is in either to the nnumber or thee mongodb object id ->done
// 3. make a function to gte all the txs in the db ->done
// 4. make a function to fetch one tx using its id ->done

const Transaction = require("../models/txModel");
const Block = require("../models/blockModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
dotenv.config("./config.env");
const apiURL = process.env.API;
//1 ?? dunno how to do //can track new pending transaction instead of new successful one
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
    return new appError("No such transaction found!", 404);
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
    return new appError("No transaction exists in the db", 404);
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
    if (!response) {
      return new appError("error fetching the transaction", 404);
    }
    let txReceipt = await response.json();
    txReceipt = txReceipt.result;
    let blockNum = txReceipt.blockNumber;
    let block = await Block.findOne({ number: blockNum });

    const blocnumhex = txReceipt.blockNumber;
    const blocnum = parseInt(blocnumhex, 16);
    const txindhex = txReceipt.transactionIndex;
    const txind = parseInt(txindhex, 16);
    //modify the body according to the data required;
    const txFinal = await Transaction.create({
      blockHash: txReceipt.blockHash,
      blockNumber: blocnum,
      transactionIndex: txind,
      transactionHash: txReceipt.transactionHash,
      from: txReceipt.from,
      to: txReceipt.to,
      gasUsed: txReceipt.gasUsed,
      contractAddress: txReceipt.contractAddress,
      block: block,
    });
  }
  return "success";
});

exports.getTxByBlockNumber = catchAsync(async (req, res, next) => {
  const bn = req.params.num;

  const transaction = await Transaction.find({
    blockNumber: bn,
  }).populate("block");
  if (transaction) {
    res.status(200).json({
      status: "sucess",
      data: transaction,
    });
  } else {
    return new appError("No such transaction found!", 404);
  }
});

exports.getBlockByTxHash = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    transactionHash: req.params.txhash,
  }).populate("block");
  if (!transaction) {
    return new appError("error fetching the transaction", 404);
  }
  const block = transaction.block;
  if (!block) {
    return new appError("error fetching block", 404);
  }
  res.status(200).json({
    status: "success",
    data: block,
  });
});

exports.getTxByAddress = catchAsync(async (req, res, next) => {
  const transactions_from = await Transaction.find({
    from: req.params.address,
  });
  const transactions_to = await Transaction.find({ to: req.params.address });
  const transactions_contr = await Transaction.find({
    contractAddress: req.params.address,
  });
  const transactions = [];
  for (let i = 0; i < transactions_from.length; i++) {
    transactions.push(transactions_from[i]);
  }
  for (let i = 0; i < transactions_to.length; i++) {
    transactions.push(transactions_to[i]);
  }
  for (let i = 0; i < transactions_contr.length; i++) {
    transactions.push(transactions_contr[i]);
  }
  if (!transactions) {
    return new appError("no transactions found", 404);
  }
  res.status(200).json({
    status: "success",
    data: transactions,
  });
});
