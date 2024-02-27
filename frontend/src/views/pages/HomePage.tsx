import {
  Text,
  Heading,
  Stack,
  SimpleGrid,
  Button,
  Wrap,
  Image,
  chakra,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Section, AppHeader } from "@/components/common";
import _ from "lodash";
import { DESCRIPTION } from "@/constants/texts";
import { AnimatePresence } from "framer-motion";
import { LatestBlockCard } from "@/components/Card/LatestBlockCard";
import { LatestTransactionCard } from "@/components/Card/LatestTransactionCard";
import { LatestStackCustomScroll } from "@/components/HomePage/LatestStackCustomScroll";
import { chains } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import Link from "next/link";
import { MainLogo } from "@/components/common/MainLogo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getAllTagByChain } from "@/services/tag";
import { InfoTooltip } from "@/components/Tooltips/InfoTooltip";
import { IChainTags } from "@/interfaces/tag";
import { getTxCount } from "@/services/stats";
import { ITxCountStats } from "@/interfaces/stats";
import { TxCountChart } from "@/components/Chart/TxCountChart";
import { SearchInput } from "@/components/Input/SearchInput";
import { DiscoverTagSection } from "@/components/HomePage/DiscoverTagSection";
import { setCacheHeader } from "@/utils/header";

interface IHomePageProps {
  allTags: IChainTags[] | null;
  txCount: ITxCountStats[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 4 hours
  setCacheHeader(context.res, 14400);

  const [allTags, txCount] = await Promise.all([
    getAllTagByChain(),
    getTxCount(),
  ]);
  return {
    props: {
      allTags,
      txCount,
    },
  };
}) satisfies GetServerSideProps<IHomePageProps>;

export const HomePage = ({ allTags, txCount }: IHomePageProps) => {
  const { txs, blocks } = useLatest({
    initialBlocks: [],
    initialTxs: [],
  });

  return (
    <>
      <AppHeader title="Home" />
      <Section>
        <Stack align="center" textAlign="center">
          <MainLogo boxSize={24} />
          <Heading>
            <chakra.span color="primary.400">evm</chakra.span>trace
          </Heading>
          <Text>{DESCRIPTION}</Text>
          <Heading size="md">Supported Chains</Heading>
          <Wrap align="center" justify="center" w="100%">
            {chains.map((c) => (
              <Image key={c.id} src={c.icon} boxSize={8} alt={c.name} />
            ))}
          </Wrap>
        </Stack>

        <SearchInput hasDetails />

        <Stack spacing={[4, null, 8]} divider={<Divider />}>
          {txCount?.length && (
            <Stack spacing={[0, 2]}>
              <HStack>
                <Heading size="md">Transaction Count</Heading>
                <InfoTooltip msg="Related transaction counts over 5 days period" />
              </HStack>
              <TxCountChart stats={txCount} />
            </Stack>
          )}

          <DiscoverTagSection tags={allTags || []} />

          <SimpleGrid columns={[1, null, 2]} spacing={[4, null, 8]}>
            <Stack>
              <HStack justify="space-between">
                <Heading size="md">Latest Blocks</Heading>
                <Button
                  as={Link}
                  href="/latest/blocks"
                  variant="outline"
                  size="sm"
                >
                  View All
                </Button>
              </HStack>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {blocks.slice(0, 12).map((block, i) => (
                    <LatestBlockCard key={block.hash} index={i} {...block} />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
            <Stack>
              <HStack justify="space-between">
                <Heading size="md">Latest Transactions</Heading>
                <Button
                  as={Link}
                  href="/latest/txs"
                  variant="outline"
                  size="sm"
                >
                  View All
                </Button>
              </HStack>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {txs.slice(0, 10).map((tx, i) => (
                    <LatestTransactionCard
                      key={tx.transaction_hash}
                      index={i}
                      {...tx}
                    />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Section>
    </>
  );
};
