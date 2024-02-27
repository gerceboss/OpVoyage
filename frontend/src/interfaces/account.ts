import { Address } from "viem";

export interface IAccountProxy {
  logic: Address;
  chain_id: number;
}
