//tasks
// 1. fetch latest block and store in db with timestamp and all details you can get ->done
// 2. make a function to retrive a block using blocknumber ->done
// 3. make a function to get all the blocks in db ->done
// 4. make a function to fetch latest 5-6 blocks
// 5. make a pre function in the block model to get all the tx hashes in a block and their details //as they will be virtual ref in the model
// -> 5 done in {{txController:78}} not in the block model
// 6. error handling like if block is not fetched or some tx is still pending ->done

// think abt how to handle so much data, either for cachinh and retreival of the lates ones u need to have some other model and update that with time
// we could delete and then store new blocks and txs (scam)
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
  if (!response) {
    return new appError("error fetching the latest block number", 404);
  }
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
  if (!resp) {
    return new appError("error fetching the latest block", 404);
  }
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
  if (!block) {
    return new appError("error fetching the block from the database", 404);
  }
  res.status(200).json({
    status: "success",
    data: block,
  });
});

//3
exports.getAllBlocks = catchAsync(async (req, res, next) => {
  const blocks = await Block.find({});
  //remember to show blocks in the frontend as per their timestamp
  if (blocks) {
    res.status(200).json({
      status: "success",
      data: blocks,
    });
  } else {
    return new appError("no blocks found", 404);
  }
});
