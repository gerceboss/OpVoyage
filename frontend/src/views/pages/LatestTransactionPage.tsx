import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import { ILatestTransaction } from "@/interfaces/transaction";
import { HStack, Heading, Image } from "@chakra-ui/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { useSince } from "@/hooks/useSince";
import { useTransactionColumn } from "@/hooks/columns/useTransactionColumn";

export const LatestTransactionPage = () => {
  const { txs } = useLatest({
    initialTxs: [],
  });

  const columns = useTransactionColumn(() => {
    const columnHelper = createColumnHelper<ILatestTransaction>();
    return {
      prefix: [
        columnHelper.accessor((r) => [r.chain_id, r.block_number] as const, {
          header: "Chain/Block",
          cell: (row) => {
            const [chainId, number] = row.getValue();
            const chain = getChain(chainId);
            return (
              <HStack>
                <Image src={chain?.icon} boxSize={4} />
                <HexHighlightBadge isBlock={chainId}>
                  {number}
                </HexHighlightBadge>
              </HStack>
            );
          },
        }),
      ],
      suffix: [
        columnHelper.accessor("block_timestamp", {
          header: "Timestamp",
          cell: (row) => {
            const since = useSince(row.getValue() * 1000);
            return since;
          },
        }),
      ],
    };
  });

  const table = useReactTable({
    data: txs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transaction_hash,
  });

  return (
    <>
      <AppHeader title="Latest Transactions" />
      <Section>
        <Heading>Latest Transactions</Heading>
        <AnimatedTable table={table} />
      </Section>
    </>
  );
};
