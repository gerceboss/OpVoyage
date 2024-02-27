import { ILatestBlock } from "@/interfaces/block";
import { ILatestTransaction } from "@/interfaces/transaction";
import { getSseLatestBlocks, getSseLatestTxs } from "@/services/latest";
import { useEffect, useState } from "react";

export const useLatest = ({
  initialTxs,
  initialBlocks,
}: {
  initialTxs?: ILatestTransaction[];
  initialBlocks?: ILatestBlock[];
}) => {
  const [txs, setTxs] = useState<ILatestTransaction[]>(initialTxs || []);
  const [blocks, setBlocks] = useState<ILatestBlock[]>(initialBlocks || []);

  useEffect(() => {
    let blockSse: EventSource | null = null;
    let txsSse: EventSource | null = null;

    if (initialBlocks !== undefined) {
      blockSse = getSseLatestBlocks();
      blockSse.onmessage = (event) => {
        setBlocks(JSON.parse(event.data).data);
      };
    }

    if (initialTxs !== undefined) {
      txsSse = getSseLatestTxs();
      txsSse.onmessage = (event) => {
        setTxs(JSON.parse(event.data).data);
      };
    }

    return () => {
      blockSse?.close();
      txsSse?.close();
    };
  }, []);

  return { txs, blocks };
};
