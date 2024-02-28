//tasks
// 1. fetch latest block and store in db with timestamp and all details you can get
// 2. make a function to retrive a block using blocknumber
// 3. make a function to get all the blocks in db
// 4. make a function to fetch latest 5-6 blocks
// 5. make a pre function in the block model to get all the tx hashes in a block and their details //as they will be virtual ref in the model
// 6. error handling like if block is not fetched or some tx is still pending

// think abt how to handle so much data, either for cachinh and retreival of the lates ones u need to have some other model and update that with time
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
const Block = require("./../models/blockModel");
const txController = require("./txController");
dotenv.config("./config.env");
const apiURL = process.env.API;

// 1
exports.latestBlock = catchAsync(async (req, res) => {
  //fetching block number
  const options1 = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method: "eth_blockNumber" }),
  };

  const response = await fetch(apiURL, options1);
  const blockData = await response.json();
  const blockNumber = blockData.result;

  const options2 = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      method: "eth_getBlockByNumber",
      params: [blockNumber, false],
      id: 1,
      jsonrpc: "2.0",
    }),
  };

  const resp = await fetch(apiURL, options2);
  let block = await resp.json();
  block = block.result;

  const txhashes = block.transactions;
  // store in database
  const blockfinal = await Block.create({
    difficulty: block.difficulty,
    number: block.number,
    hash: block.hash,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
    transactions: block.transactions,
    transactionsRoot: block.transactionsRoot,
    uncles: block.uncles,
    parentHash: block.parentHash,
    sha3Uncles: block.sha3Uncles,
    miner: block.miner,
    nonce: block.miner,
    timestamp: block.timestamp,
  });
  // const blockfinal = await Block.create({ block });
  txController.saveTxs(txhashes);
  res.status(200).json({
    status: "success",
    data: blockfinal,
  });
});

//2
exports.latestBlockByNumber = catchAsync(async (req, res, next) => {
  const blockNumber = req.params.num;
  const block = await Block.findOne({ number: blockNumber });
  res.status(200).json({
    status: "success",
    data: block,
  });
});

//3
exports.getAllBlocks = catchAsync(async (req, res, next) => {
  const blocks = await Block.find({});
  //remember to show blocks in the frintend as per their timestamp
  if (blocks) {
    res.status(200).json({
      status: "success",
      data: blocks,
    });
  } else {
    return appError("no blocks found", 404);
  }
});
