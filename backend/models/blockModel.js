const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  //difficulty- The integer of the difficulty for this block encoded as a hexadecimal --done
  // extraData- The “extra data” field of this block ----------------------
  // gasLimit- The maximum gas allowed in this block encoded as a hexadecimal --done
  // gasUsed- The total used gas by all transactions in this block encoded as a hexadecimal --done
  // hash- The block hash of the requested block. null if pending --done
  // logsBloom- The bloom filter for the logs of the block. null if pending ----------------------
  // miner- The address of the beneficiary to whom the mining rewards were given --done
  // mixHash- A string of a 256-bit hash encoded as a hexadecimal --------------------
  // nonce- The hash of the generated proof-of-work. null if pending --done
  // number- The block number of the requested block encoded as a hexadecimal. null if pending --done
  // parentHash- The hash of the parent block --done
  // receiptsRoot- The root of the receipts trie of the block ---------------------
  // sha3Uncles- The SHA3 of the uncles data in the block --done
  // size- The size of this block in bytes as an Integer value encoded as hexadecimal
  // stateRoot- The root of the final state trie of the block -------------------
  // timestamp- The unix timestamp for when the block was collated --done
  // totalDifficulty- The integer of the total difficulty of the chain until this block encoded as a hexadecimal  ---------------
  // transactions- An array of transaction objects - please see eth_getTransactionByHash for exact shape --done
  // transactionsRoot- The root of the transaction trie of the block --done
  // uncles- An array of uncle hashes --done
  difficulty: {
    type: Number,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  gasUsed: {
    type: Number,
    required: true,
  },
  gasLimit: {
    type: Number,
    required: true,
  },
  transactions: {
    type: [String],
    required: true,
  },
  transactionsRoot: {
    type: String,
    require: true,
  },
  uncles: {
    type: [String],
    required: true,
  },
  parentHash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
  miner: {
    type: String,
    required: true,
  },
  sha3Uncles: {
    type: String,
    required: true,
  },
  chain_id: {
    type: Number,
    required: true,
    default: 5611,
  },
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
