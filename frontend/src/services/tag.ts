import { IAggregatedTag, IChainTags, ITag } from "@/interfaces/tag";
import axios from "axios";
import { Address } from "viem";

export const getAllTags = async (): Promise<IAggregatedTag[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tag/all`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};

export const getAllTagByChain = async (): Promise<IChainTags[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tag/all_by_chain`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};

export const getTags = async (addresses: Address[]): Promise<ITag[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tag/${addresses.join(
    ","
  )}`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};

export const getTagAddresses = async (
  tag: string,
  page?: number,
  size?: number
): Promise<ITag[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tag/tags/${tag}?page=${
    page || 0
  }&size=${size || 50}`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};
