import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import { useSince } from "@/hooks/useSince";
import { ILatestBlock } from "@/interfaces/block";
import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import numbro from "numbro";
import { useMemo } from "react";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";

export const LatestBlocksPage = () => {
  const { blocks } = useLatest({
    initialBlocks: [],
  });

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ILatestBlock>();
    return [
      columnHelper.accessor("chain_id", {
        header: "Chain",
        cell: (row) => {
          const chainId = row.getValue();
          const chain = getChain(chainId);
          return <Image src={chain?.icon} boxSize={4} />;
        },
      }),
      columnHelper.accessor((r) => [r.chain_id, r.number] as const, {
        header: "Number",
        cell: (row) => {
          const [chainId, number] = row.getValue();
          return (
            <HexHighlightBadge isBlock={chainId}>{number}</HexHighlightBadge>
          );
        },
      }),
      columnHelper.accessor("hash", {
        header: "Hash",
        cell: (row) => <HexHighlightBadge>{row.getValue()}</HexHighlightBadge>,
      }),
      columnHelper.accessor("transaction_count", {
        header: "Txs",
      }),
      columnHelper.accessor("related_transaction_count", {
        header: "Related Txs",
      }),
      columnHelper.accessor((r) => [r.gas_limit, r.gas_used] as const, {
        header: "Gas Used",
        cell: (row) => {
          const [gasLimit, gasUsed] = row.getValue();
          const pct = gasUsed / gasLimit;
          return (
            <Stack spacing={1}>
              <Text>
                {numbro(gasUsed).format({ thousandSeparated: true })} (
                {numbro(pct).format({
                  output: "percent",
                  mantissa: 2,
                  optionalMantissa: true,
                })}
                )
              </Text>
              <Box
                bg="whiteAlpha.400"
                h={0.5}
                w="full"
                rounded="full"
                position="relative"
                _after={{
                  content: '""',
                  position: "absolute",
                  h: "full",
                  w: `${pct * 100}%`,
                  bg: "primary.400",
                  rounded: "full",
                }}
              />
            </Stack>
          );
        },
      }),
      columnHelper.accessor("timestamp", {
        header: "Timestamp",
        cell: (row) => {
          const since = useSince(row.getValue() * 1000);
          return since;
        },
      }),
    ];
  }, []);

  const table = useReactTable({
    data: blocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.hash,
  });

  return (
    <>
      <AppHeader title="Latest Blocks" />
      <Section>
        <Heading>Latest Blocks</Heading>
        <AnimatedTable table={table} />
      </Section>
    </>
  );
};
