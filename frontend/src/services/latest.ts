import { ILatestBlock } from "@/interfaces/block";
import { ILatestTransaction } from "@/interfaces/transaction";
import axios from "axios";

export const getLatestBlocks = async (): Promise<ILatestBlock[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blocks/latest`;
  return await axios.get(url).then((res) => {
    console.log(res.data);
    return res.data;
  });
};

export const getLatestTxs = async (): Promise<ILatestTransaction[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/txs/latest`;
  return await axios.get(url).then((res) => res.data);
};

export const getSseLatestBlocks = () => {
  return new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/block/latest`
  );
};

export const getSseLatestTxs = () => {
  return new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/api/txs/latest/sse`
  );
};
