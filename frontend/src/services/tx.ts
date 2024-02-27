import { IDetailedTransaction } from "@/interfaces/transaction";
import axios from "axios";

export const getTx = async (
  hash: string
): Promise<IDetailedTransaction | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tx/${hash}`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    return null;
  }
};
