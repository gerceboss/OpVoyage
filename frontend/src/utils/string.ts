import { Hex } from "viem";

export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

export const formatHex = (address?: string | Hex) => {
  const addr = address?.toLowerCase();
  return `${addr?.slice(0, 8)}..${addr?.slice(-6)}`;
};
