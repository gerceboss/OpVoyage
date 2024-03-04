import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { IBlock } from "@/interfaces/block";
import { IBlockTransaction } from "@/interfaces/transaction";
import { getBlock, getBlockTxs } from "@/services/block";
import {
  Center,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { GetServerSidePropsContext, GetServerSideProps } from "next";
import { AnimatedTable } from "../layouts/AnimatedTable";
import _ from "lodash";
import { useTransactionColumn } from "@/hooks/columns/useTransactionColumn";
import numbro from "numbro";
import { WrapItem } from "@/components/BlockPage/WrapItem";
import { PercentageBadge } from "@/components/Badge/PercentageBadge";
import { SectionItem } from "@/components/BlockPage/SectionItem";
import moment from "@/constants/moment";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { setCacheHeader } from "@/utils/header";

interface IBlockPageProps {
  block: IBlock | null;
  txs: IBlockTransaction[] | null;
  totalTxsGas: number;
  totalTxsGasFirstDegree: number;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 4 hours
  setCacheHeader(context.res, 14400);

  const { chainId: cid, number } = context.query;
  const chainId = Number(cid);
  const blockNumber = Number(number);

  if (isNaN(chainId) || isNaN(blockNumber)) {
    return {
      props: {
        block: null,
        txs: null,
        totalTxsGas: 0,
        totalTxsGasFirstDegree: 0,
      },
    };
  }

  const [block, txs] = await Promise.all([
    getBlock(chainId, blockNumber),
    getBlockTxs(chainId, blockNumber),
  ]);

  return {
    props: {
      block,
      txs,
      totalTxsGas: txs ? _.reduce(txs, (s, tx) => s + tx.gas_used_total, 0) : 0,
      totalTxsGasFirstDegree: txs
        ? _.reduce(txs, (s, tx) => s + tx.gas_used_first_degree, 0)
        : 0,
    },
  };
}) satisfies GetServerSideProps<IBlockPageProps>;

export const BlockPage = ({
  block,
  txs,
  totalTxsGas,
  totalTxsGasFirstDegree,
}: IBlockPageProps) => {
  const chain = getChain(block?.chain_id);
  const columns = useTransactionColumn();

  const table = useReactTable({
    data: txs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transactionHash,
  });

  return (
    <>
      <AppHeader
        title={
          !block ? "Block not found" : `${chain?.name} Block ${block?.number}`
        }
      />
      <Section>
        {!block || !chain ? (
          <Center>Block not found</Center>
        ) : (
          (() => {
            const externalExplorerUrl = `${chain.blockExplorers.default.url}/block/${block.number}`;
            return (
              <>
                <Stack spacing={0}>
                  <Heading>Block {block.number}</Heading>
                  <HStack>
                    <Image
                      src="data:image/png;base64,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"
                      alt={chain.name}
                      boxSize={4}
                    />
                    <Text>
                      {chain.name}{" "}
                      <chakra.span as="i">({chain.id})</chakra.span>
                    </Text>
                  </HStack>
                </Stack>

                <Stack>
                  <SectionItem title="Height" value={block.number} />
                  <SectionItem
                    title="Hash"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {block.hash}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Parent Hash"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {block.parentHash}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Timestamp"
                    value={`${moment(
                      block.timestamp * 1000
                    ).fromNow()} | ${moment(block.timestamp * 1000).format()}`}
                  />
                  <SectionItem
                    title="External Explorer"
                    value={
                      <Link isExternal href={externalExplorerUrl}>
                        {externalExplorerUrl}
                      </Link>
                    }
                  />
                  {/* <SectionItem
                    title="Transactions"
                    value={[
                      <WrapItem
                        title="Total Txs"
                        value={block.transaction_count}
                        tooltip="Total transactions in this block"
                      />,
                      <WrapItem
                        title="Related Txs"
                        value={txs?.length || 0}
                        tooltip="Total ZK/AA transactions in this block"
                      />,
                      <WrapItem
                        title="ZK Txs"
                        value={
                          txs?.filter((tx) => tx.ec_pairing_count > 0).length ||
                          0
                        }
                        tooltip="Total transaction that uses zk verification or bls signature verification"
                      />,
                      <WrapItem
                        title="AA Txs"
                        value={
                          txs?.filter(
                            (tx) => tx.ec_recover_addresses.length > 0
                          ).length || 0
                        }
                        tooltip="Total transaction that uses EC recover"
                      />,
                    ]}
                  /> */}
                  <SectionItem
                    title="Gas"
                    value={[
                      <WrapItem
                        title="Gas Limit"
                        value={numbro(block.gasLimit).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas limit of all transactions"
                      />,
                      <WrapItem
                        title="Gas Used"
                        value={numbro(block.gasUsed).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas used by all transactions"
                        suffix={
                          <PercentageBadge
                            value={block.gasUsed / block.gasLimit}
                          />
                        }
                      />,
                      <WrapItem
                        title="GU ZK/AA Txs"
                        value={numbro(totalTxsGas).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas used by all zk/aa transactions"
                        suffix={
                          <PercentageBadge
                            value={totalTxsGas / block.gasLimit}
                          />
                        }
                      />,
                      <WrapItem
                        title="GU ZK/AA Contracts"
                        value={numbro(totalTxsGasFirstDegree).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas used by all zk/aa contracts (excluding calls to unrelated contracts) in zk/aa transactions"
                        suffix={
                          <PercentageBadge
                            value={totalTxsGasFirstDegree / block.gasLimit}
                          />
                        }
                      />,
                    ]}
                  />
                </Stack>
                <Heading size="lg">Transactions</Heading>
                <AnimatedTable table={table} />
              </>
            );
          })()
        )}
      </Section>
    </>
  );
};
