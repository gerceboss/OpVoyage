import { MiniIdenticon } from "@/components/Icon/MiniIdenticon";
import { AppHeader, Section } from "@/components/common";
import { useTransactionColumn } from "@/hooks/columns/useTransactionColumn";
import {
  AccountType,
  IAccountTransaction,
  IAccountType,
} from "@/interfaces/transaction";
import { getAccountProxy, getAccountTxs } from "@/services/account";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Address, checksumAddress } from "viem";
import { useEnsAvatar, useEnsName } from "wagmi";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { getChain } from "@/constants/web3";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { getTags } from "@/services/tag";
import { ITag } from "@/interfaces/tag";
import { TagsBadge } from "@/components/Badge/TagBadge";
import _ from "lodash";
import { IAccountProxy } from "@/interfaces/account";
import { ChainIcon } from "@/components/Icon/ChainIcon";
import { InfoTooltip } from "@/components/Tooltips/InfoTooltip";
import { setCacheHeader } from "@/utils/header";

interface IAccountPageProps {
  address: Address | null;
  txs: IAccountTransaction[] | null;
  tags: ITag[] | null;
  proxy: IAccountProxy[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 10 seconds
  setCacheHeader(context.res, 10);

  try {
    const { address: a } = context.params as { address: string };
    const aChecksumed = checksumAddress(a as Address);
    const { page: p } = context.query;
    const page = p ? parseInt(p as string) : 1;
    const proxied = await getAccountProxy(aChecksumed);
    const [[txs, address], tags] = await Promise.all([
      getAccountTxs(aChecksumed, page - 1),
      getTags([aChecksumed]),
      ...(proxied?.map((p) => p.logic) || []),
    ]);

    return {
      props: {
        txs,
        address,
        tags,
        proxy: proxied,
      },
    };
  } catch (e) {
    return {
      props: {
        txs: null,
        address: null,
        tags: null,
        proxy: null,
      },
    };
  }
}) satisfies GetServerSideProps<IAccountPageProps>;

export const AccountPage = ({
  txs,
  address,
  tags,
  proxy,
}: IAccountPageProps) => {
  const columns = useTransactionColumn(() => {
    const columnHelper = createColumnHelper<IAccountTransaction>();

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
        columnHelper.accessor("type", {
          header: "Tx Type",
          cell: (row) => {
            const types: IAccountType[] = row.getValue();
            return (
              <Stack spacing={1}>
                {types.map((t, i) => (
                  <Badge
                    key={i}
                    colorScheme={AccountType[t].colorScheme}
                    variant="solid"
                  >
                    {t}
                  </Badge>
                ))}
              </Stack>
            );
          },
        }),
      ],
    };
  });
  const table = useReactTable({
    data: txs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transaction_hash,
  });

  return (
    <>
      <AppHeader title={`Account ${address || "Not Found"}`} />
      <Section>
        {!address ? (
          <Center>Address not found</Center>
        ) : (
          <InnerAccountPage
            address={address}
            table={table}
            txLength={txs?.length || 0}
            tags={_.uniq(tags?.find((e) => e.address === address)?.tags)}
            proxy={proxy?.map((p) => ({
              ...p,
              tags: _.uniq(
                tags?.find((e) => e.address === p.logic)?.tags || []
              ),
            }))}
          />
        )}
      </Section>
    </>
  );
};

const InnerAccountPage = ({
  address,
  table,
  txLength,
  tags,
  proxy,
}: {
  address: Address;
  table: Table<IAccountTransaction>;
  txLength: number;
  tags: string[];
  proxy?: {
    logic: Address;
    chain_id: number;
    tags: string[];
  }[];
}) => {
  const { data: ensName } = useEnsName({
    address: address,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
  });

  const router = useRouter();
  const page = useMemo(
    () => parseInt(router.query.page as string) || 1,
    [router.query.page]
  );

  return (
    <>
      <Heading>Account</Heading>
      <HStack>
        <MiniIdenticon
          address={address}
          boxSize={[12, null, 8]}
          src={ensAvatar || undefined}
          rounded="full"
        />
        <Text as="b" fontSize={["lg", "xl"]} overflowWrap="anywhere">
          {ensName || address}
        </Text>
      </HStack>
      <TagsBadge
        tags={tags}
        fallback={<Badge fontSize="md">Unknown</Badge>}
        fontSize="md"
      />
      {!!proxy?.length && (
        <Stack spacing={0}>
          <HStack>
            <Heading size="md">Proxy</Heading>
            <InfoTooltip msg="Proxy logic used by this contract" />
          </HStack>
          <Box h={1} />
          {proxy.map((p) => (
            <HStack key={p.logic}>
              <ChainIcon chainId={p.chain_id} />
              <HexHighlightBadge isAccount isFull>
                {p.logic}
              </HexHighlightBadge>
              <TagsBadge tags={p.tags} />
            </HStack>
          ))}
        </Stack>
      )}
      <HStack justify="end">
        <ButtonGroup size="sm" variant="outline">
          <IconButton
            icon={<Icon as={LuChevronLeft} />}
            aria-label="Back"
            isDisabled={page <= 1}
            onClick={() => router.push(`/address/${address}?page=${page - 1}`)}
          />
          <Button pointerEvents="none">{page}</Button>
          <IconButton
            icon={<Icon as={LuChevronRight} />}
            aria-label="Back"
            isDisabled={page > 10 || txLength < 50}
            onClick={() => router.push(`/address/${address}?page=${page + 1}`)}
          />
        </ButtonGroup>
      </HStack>
      <AnimatedTable table={table} />
    </>
  );
};
