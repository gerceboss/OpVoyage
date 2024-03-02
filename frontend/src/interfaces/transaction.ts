import { Address, Hex } from "viem";
import { IBlock } from "./block";
export interface ITransaction {
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  transactionHash: string;
  from: string;
  to: string;
  // value: bigint;
  gasUsed: number;
  contractAddress: string;
  block: IBlock;
}

export type IDetailedTransaction = ITransaction & {
  block_number: number;
  block_timestamp: number;
};

export type IBlockTransaction = ITransaction & {
  gas_used_total: number;
  gas_used_first_degree: number;
};

export type ILatestTransaction = ITransaction & {
  block_number: number;
  block_timestamp: number;
};

export enum IAccountType {
  FROM = "out",
  TO = "in",
  RECOVERED = "recovered",
  RELATED = "related",
}

export const AccountType = {
  [IAccountType.FROM]: {
    colorScheme: "yellow",
  },
  [IAccountType.TO]: { colorScheme: "green" },
  [IAccountType.RECOVERED]: { colorScheme: "cyan" },
  [IAccountType.RELATED]: { colorScheme: "purple" },
} as const;

export type IAccountTransaction = ITransaction & {
  block_number: number;
  closest_address: Address[];
  type: IAccountType[];
};

export enum ITransactionType {
  ZK = "ZK",
  RECOVER = "RECOVER",
}

export const TransactionType = {
  [ITransactionType.ZK]: {
    label: "ZK",
    colorScheme: "orange",
  },
  [ITransactionType.RECOVER]: {
    label: "RECOVER",
    colorScheme: "cyan",
  },
} as const;
