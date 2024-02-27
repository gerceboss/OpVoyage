import { ILatestBlock } from "@/interfaces/block";
import { ILatestTransaction } from "@/interfaces/transaction";
import axios from "axios";

export const getLatestBlocks = async (): Promise<ILatestBlock[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/latest/blocks`;
  return await axios.get(url).then((res) => res.data.data);
};

export const getLatestTxs = async (): Promise<ILatestTransaction[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/latest/txs`;
  return await axios.get(url).then((res) => res.data.data);
};

export const getSseLatestBlocks = () => {
  return new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/latest/blocks/sse`
  );
};

export const getSseLatestTxs = () => {
  return new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/latest/txs/sse`
  );
};
