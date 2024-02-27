import { IBlock } from "@/interfaces/block";
import { IBlockTransaction } from "@/interfaces/transaction";
import axios from "axios";

export const getBlock = async (
  chainId: number,
  blockNumber: number
): Promise<IBlock | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/block/${chainId}/${blockNumber}`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};

export const getBlockTxs = async (
  chainId: number,
  blockNumber: number
): Promise<IBlockTransaction[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/block/${chainId}/${blockNumber}/txs`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};
