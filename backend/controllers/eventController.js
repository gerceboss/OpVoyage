const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
const Block = require("./../models/blockModel");
const Transaction = require("./../models/txModel");
const txController = require("./txController");
dotenv.config({ path: "./config.env" });
const apiURL = process.env.API;
exports.latestBlockEvent = catchAsync(async (req, res, next) => {
  // // Set headers

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  };

  //write the headers
  res.writeHead(200, headers);

  let data = [];
  setInterval(async () => {
    const options1 = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_blockNumber",
      }),
    };

    const response = await fetch(apiURL, options1);
    if (!response) {
      return new appError("error fetching the latest block number", 404);
    }
    const blockData = await response.json();
    const blockNumber = blockData.result;

    const options2 = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
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
    data.push(block);
    // console.log(data);
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
    // const txs = txhashes;
    // // const blockfinal = await Block.create({ block });
    // for (let i in txs) {
    //   const options = {
    //     method: "POST",
    //     headers: {
    //       accept: "application/json",
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       method: "eth_getTransactionReceipt",
    //       params: [`${txs[i]}`],
    //       id: 1,
    //       jsonrpc: "2.0",
    //     }),
    //   };
    //   const response = await fetch(apiURL, options);
    //   if (!response) {
    //     return new appError("error fetching the transaction", 404);
    //   }
    //   let txReceipt = await response.json();
    //   txReceipt = txReceipt.result;
    //   console.log(txReceipt);
    //   let blockNum = txReceipt.blockNumber;
    //   let block = await Block.findOne({ number: blockNum });

    //   const blocnumhex = txReceipt.blockNumber;
    //   const blocnum = parseInt(blocnumhex, 16);
    //   const txindhex = txReceipt.transactionIndex;
    //   const txind = parseInt(txindhex, 16);
    //   //modify the body according to the data required;
    //   const txFinal = await Transaction.create({
    //     blockHash: txReceipt.blockHash,
    //     blockNumber: blocnum,
    //     transactionIndex: txind,
    //     transactionHash: txReceipt.transactionHash,
    //     from: txReceipt.from,
    //     to: txReceipt.to,
    //     gasUsed: txReceipt.gasUsed,
    //     contractAddress: txReceipt.contractAddress,
    //     block: block,
    //   });
    // }
    const obj = {
      data: data,
    };
    // console.log(data);
    res.write(`data:${JSON.stringify(obj)}\n\n`);
  }, 2000);
});
