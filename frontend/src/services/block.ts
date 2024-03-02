import { IBlock } from "@/interfaces/block";
import { IBlockTransaction } from "@/interfaces/transaction";
import axios from "axios";

export const getBlock = async (
  chainId: number,
  blockNumber: number
): Promise<IBlock | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blocks/${blockNumber}`;
  try {
    return await axios.get(url).then((res) => res.data || null);
  } catch (e) {
    return null;
  }
};

export const getBlockTxs = async (
  chainId: number,
  blockNumber: number
): Promise<IBlockTransaction[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blocks/${blockNumber}/txs`;
  try {
    return await axios.get(url).then((res) => res.data || null);
  } catch (e) {
    return null;
  }
};
