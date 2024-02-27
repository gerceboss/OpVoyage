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
    getRowId: (row) => row.transaction_hash,
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
                    <Image src={chain.icon} alt={chain.name} boxSize={4} />
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
                        {block.parent_hash}
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
                    title="Size"
                    value={`${block.size} Bytes`}
                    tooltip="Size of the block in bytes"
                  />
                  <SectionItem
                    title="External Explorer"
                    value={
                      <Link isExternal href={externalExplorerUrl}>
                        {externalExplorerUrl}
                      </Link>
                    }
                  />
                  <SectionItem
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
                  />
                  <SectionItem
                    title="Gas"
                    value={[
                      <WrapItem
                        title="Gas Limit"
                        value={numbro(block.gas_limit).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas limit of all transactions"
                      />,
                      <WrapItem
                        title="Gas Used"
                        value={numbro(block.gas_used).format({
                          thousandSeparated: true,
                        })}
                        tooltip="Total gas used by all transactions"
                        suffix={
                          <PercentageBadge
                            value={block.gas_used / block.gas_limit}
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
                            value={totalTxsGas / block.gas_limit}
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
                            value={totalTxsGasFirstDegree / block.gas_limit}
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
