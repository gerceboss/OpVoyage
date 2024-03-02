import { Hex } from "viem";

export interface IBlock {
  difficulty: number;
  hash: string;
  gasUsed: number;
  gasLimit: number;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
  parentHash: string;
  timestamp: number;
  number: number;
  nonce: number;
  miner: string;
  sha3Uncles: string;
  chain_id: number;
}

export interface ILatestBlock {
  difficulty: number;
  hash: string;
  gasUsed: number;
  gasLimit: number;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
  parentHash: string;
  timestamp: number;
  number: number;
  nonce: number;
  miner: string;
  sha3Uncles: string;
  chain_id: number;
}
