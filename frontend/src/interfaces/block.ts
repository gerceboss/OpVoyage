import { Hex } from "viem";

export interface IBlock {
  // chain_id: number;
  number: number;
  timestamp: number; // change backend model to number
  hash: Hex; //will string and hex match?
  parent_hash: Hex;
  transaction_count: number;
  nonce: Hex;
  miner: Hex;
  difficulty: number; // done
  total_difficulty: number;
  size: number;
  gas_limit: number;
  gas_used: number;
  base_fee_per_gas: number;
}

export interface ILatestBlock {
  chain_id: number;
  number: number;
  timestamp: number;
  hash: Hex;
  transaction_count: number;
  related_transaction_count: number;
  gas_limit: number;
  gas_used: number;
}
