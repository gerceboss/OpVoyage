import { Address, Hex } from "viem";

export interface ITransaction {
  chain_id: number;
  transaction_hash: Hex;
  transaction_index: number;
  from_address: Address;
  to_address: Address;
  value: bigint;
  error?: string;
  ec_pairing_count: number;
  ec_recover_addresses: Address[];
  function_signature: string;
  function_name?: string;
}

export type IDetailedTransaction = ITransaction & {
  block_number: number;
  block_timestamp: number;
  input: Hex;
  gas_used_total: number;
  gas_used_first_degree: number;
  ec_recover_count: number;
  ec_pairing_input_sizes: number[];
  closest_address: Address[];
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
