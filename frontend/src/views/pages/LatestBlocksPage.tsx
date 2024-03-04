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
    initialTxs: [],
  });

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ILatestBlock>();
    return [
      columnHelper.accessor("chain_id", {
        header: "Chain",
        cell: (row) => {
          const chainId = row.getValue();
          const chain = getChain(chainId);
          return (
            <Image
              src="data:image/png;base64,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"
              boxSize={4}
            />
          );
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

      columnHelper.accessor((r) => [r.gasLimit, r.gasUsed] as const, {
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
