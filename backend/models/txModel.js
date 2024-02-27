const mongoose = require("mongoose");

const txSchema = mongoose.Schema({
  // 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log
  blockHash: {
    type: String || null,
  },
  // The block number where this log was in. null when its pending. null when its pending log.
  blockNumber: {
    type: String || null, //can be null //change it to integer???
  },
  // Integer of the transactions index position log was created from. null when its pending log.
  transactionIndex: {
    type: String || null,
  },
  // 32 Bytes - hash of the transaction
  transactionHash: {
    type: String,
    required: true,
  },
  // 20 Bytes - address of the sender
  from: {
    type: String,
    required: true,
  },
  // 20 Bytes - address of the receiver. null when its a contract creation transaction
  to: {
    type: String,
    required: true,
  },
  // cumulativeGasUsed
  // string
  // The total amount of gas used when this transaction was executed in the block.


  // The amount of gas used by this specific transaction alone
  gasUsed: {
    type: Number,
    required: true,
  },
  // 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null
  contractAddress: {
    type: String || null,
  },
  // logs
  // array of objects
  // Array of log objects, which this transaction generated

  // object
  // blockHash
  // string
  // 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log

  // blockNumber
  // string
  // The block number where this log was in. null when its pending. null when its pending log.

  // transactionIndex
  // string
  // Integer of the transactions index position log was created from. null when its pending log.

  // address
  // string
  // 20 Bytes - address from which this log originated.

  // logIndex
  // string
  // Integer of the log index position in the block. null when its pending log.

  // data
  // string
  // Contains one or more 32 Bytes non-indexed arguments of the log.

  // removed
  // boolean
  // true when the log was removed, due to a chain reorganization. false if its a valid log.

  // topics
  // array of strings
  // Array of zero to four 32 Bytes DATA of indexed log arguments. In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declare the event with the anonymous specifier.

  // transactionHash
  // string
  // Hash of the transactions this log was created from. null when its pending log.

  // logsBloom
  // string
  // 256 Bytes - Bloom filter for light clients to quickly retrieve related logs

  // root
  // string
  // 32 bytes of post-transaction stateroot (pre Byzantium)

  // status
  // integer
  // Either 1 (success) or 0 (failure)

  // 1
  // effectiveGasPrice
  // string
  // type
  // string
});

const Transaction = mongoose.model("Transaction", txSchema);
module.exports = Transaction;
