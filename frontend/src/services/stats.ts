import { ITxCountStats, txCountStatsFromResponse } from "@/interfaces/stats";
import axios from "axios";

export const getTxCount = async (): Promise<ITxCountStats[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stats/tx_count`;
  try {
    return await axios
      .get(url)
      .then(
        (res) =>
          res.data?.data.map((e: any[]) => txCountStatsFromResponse(e)) || null
      );
  } catch (e) {
    return null;
  }
};
