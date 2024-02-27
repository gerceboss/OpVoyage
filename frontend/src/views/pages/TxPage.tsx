import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { SectionItem } from "@/components/BlockPage/SectionItem";
import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import {
  IDetailedTransaction,
  TransactionType,
} from "@/interfaces/transaction";
import { getTx } from "@/services/tx";
import {
  Badge,
  Button,
  ButtonGroup,
  Center,
  Code,
  Divider,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import moment from "@/constants/moment";
import numbro from "numbro";
import { decodeFunctionData, formatEther, parseAbi } from "viem";
import { PercentageBadge } from "@/components/Badge/PercentageBadge";
import { useEffect, useMemo, useState } from "react";
import { ITag } from "@/interfaces/tag";
import { getTags } from "@/services/tag";
import { TagsBadge } from "@/components/Badge/TagBadge";
import _ from "lodash";
import { setCacheHeader } from "@/utils/header";

interface ITxPageProps {
  tx: IDetailedTransaction | null;
  tags: ITag[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 4 hours
  setCacheHeader(context.res, 14400);

  const { hash: h } = context.params as { hash: string };
  const hash = String(h);
  const tx = await getTx(hash);
  const tags = tx
    ? await getTags([tx.to_address, ...tx.closest_address])
    : null;

  return {
    props: {
      tx,
      tags,
    },
  };
}) satisfies GetServerSideProps<ITxPageProps>;

export const TxPage = ({ tx, tags }: ITxPageProps) => {
  const chain = getChain(tx?.chain_id);

  return (
    <>
      <AppHeader
        title={
          !tx ? "Block not found" : `${chain?.name} Tx ${tx?.transaction_hash}`
        }
      />
      <Section>
        {!tx || !chain ? (
          <Center>Transaction not found</Center>
        ) : (
          (() => {
            const [isFormatted, setIsFormatted] = useState(false);
            const [, parsed] = useMemo(() => {
              if (!tx.input || !tx.function_name)
                return [undefined, undefined] as const;
              try {
                const abi = parseAbi([
                  `function ${tx.function_name}` as string,
                ]) as any[];
                const result = decodeFunctionData({
                  abi,
                  data: tx.input,
                }) as { args: any[]; functionName: string };
                return [abi, result] as const;
              } catch (e) {
                console.error(e);
                return [undefined, undefined] as const;
              }
            }, []);

            useEffect(() => {
              if (parsed) {
                setIsFormatted(true);
              }
            }, [parsed]);

            const externalExplorerUrl = `${chain.blockExplorers.default.url}/tx/${tx.transaction_hash}`;

            return (
              <>
                <Heading>Transaction Detail</Heading>
                <Stack>
                  <SectionItem
                    title="Chain"
                    value={
                      <HStack>
                        <Image src={chain.icon} alt={chain.name} boxSize={4} />
                        <Text>
                          {chain.name}{" "}
                          <chakra.span as="i">({chain.id})</chakra.span>
                        </Text>
                      </HStack>
                    }
                  />
                  <SectionItem
                    title="Tags"
                    value={
                      <TagsBadge
                        tags={_.uniq(tags?.flatMap((e) => e.tags))}
                        fallback={<Badge>Unknown</Badge>}
                      />
                    }
                  />
                  <SectionItem
                    title="Status"
                    value={
                      <Badge colorScheme={tx.error ? "red" : "green"}>
                        {tx.error || "Success"}
                      </Badge>
                    }
                  />
                  <SectionItem
                    title="Block Height"
                    value={
                      <HexHighlightBadge isBlock={tx.chain_id}>
                        {tx.block_number}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Timestamp"
                    value={`${moment(
                      tx.block_timestamp * 1000
                    ).fromNow()} | ${moment(
                      tx.block_timestamp * 1000
                    ).format()}`}
                  />
                  <SectionItem
                    title="Transaction Hash"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {tx.transaction_hash}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="External Explorer"
                    value={
                      <Link isExternal href={externalExplorerUrl}>
                        {externalExplorerUrl}
                      </Link>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="From"
                    value={
                      <HexHighlightBadge isFull wrap isAccount>
                        {tx.from_address}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Interact With (To)"
                    value={
                      <HStack>
                        <HexHighlightBadge isFull wrap isAccount>
                          {tx.to_address}
                        </HexHighlightBadge>
                        <TagsBadge
                          tags={
                            tags?.find((t) => t.address === tx.to_address)?.tags
                          }
                        />
                      </HStack>
                    }
                  />
                  <SectionItem
                    title="Related Contract"
                    tooltip="The contracts this transaction interacts with that are related to ZK/Recover"
                    align="start"
                    value={
                      <Stack spacing={0}>
                        {tx.closest_address.map((a) => (
                          <HStack key={a}>
                            <HexHighlightBadge isFull wrap isAccount>
                              {a}
                            </HexHighlightBadge>
                            <TagsBadge
                              tags={tags?.find((t) => t.address === a)?.tags}
                            />
                          </HStack>
                        ))}
                      </Stack>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Value"
                    value={`${numbro(formatEther(tx.value)).format({
                      mantissa: 18,
                      optionalMantissa: true,
                      trimMantissa: true,
                      thousandSeparated: true,
                    })} ${chain.nativeCurrency.symbol}`}
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Gas Used"
                    value={numbro(tx.gas_used_total).format({
                      thousandSeparated: true,
                    })}
                  />
                  <SectionItem
                    title="Gas Used By ZK/Recover Contracts"
                    value={
                      <HStack>
                        <Text>
                          {numbro(tx.gas_used_first_degree).format({
                            thousandSeparated: true,
                          })}
                        </Text>
                        <PercentageBadge
                          value={tx.gas_used_first_degree / tx.gas_used_total}
                        />
                        {tx.gas_used_first_degree > tx.gas_used_total && (
                          <Badge colorScheme="red">Some Calls Reverted</Badge>
                        )}
                      </HStack>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Type"
                    value={
                      <HStack>
                        {tx.ec_pairing_count > 0 && (
                          <Badge colorScheme={TransactionType.ZK.colorScheme}>
                            {TransactionType.ZK.label}
                          </Badge>
                        )}
                        {tx.ec_recover_addresses.length > 0 && (
                          <Badge
                            colorScheme={TransactionType.RECOVER.colorScheme}
                          >
                            {TransactionType.RECOVER.label}
                          </Badge>
                        )}
                      </HStack>
                    }
                  />
                  {tx.ec_pairing_count > 0 && (
                    <>
                      <SectionItem
                        title="Proof Verified"
                        value={tx.ec_pairing_count}
                      />
                    </>
                  )}
                  {tx.ec_recover_count > 0 && (
                    <>
                      <SectionItem
                        title="Account Recovered"
                        value={tx.ec_recover_count}
                      />
                      <SectionItem
                        title="Unique Account Recovered"
                        value={tx.ec_recover_addresses.length}
                      />
                      <SectionItem
                        title="Accounts"
                        align="start"
                        value={
                          <Stack spacing={0}>
                            {tx.ec_recover_addresses.map((a) => (
                              <HexHighlightBadge isFull wrap key={a} isAccount>
                                {a}
                              </HexHighlightBadge>
                            ))}
                          </Stack>
                        }
                      />
                    </>
                  )}
                </Stack>
                <Divider my={4} />
                <SectionItem
                  title="Function"
                  value={
                    <HexHighlightBadge wrap>
                      {tx.function_name || tx.function_signature}
                    </HexHighlightBadge>
                  }
                />
                <SectionItem
                  title="Input"
                  align="start"
                  value={
                    <Stack>
                      <ButtonGroup isAttached size="sm">
                        <Button
                          isDisabled={!parsed}
                          isActive={isFormatted}
                          pointerEvents={isFormatted ? "none" : "auto"}
                          onClick={() => setIsFormatted(true)}
                        >
                          Formatted
                        </Button>
                        <Button
                          isActive={!isFormatted}
                          pointerEvents={!isFormatted ? "none" : "auto"}
                          onClick={() => setIsFormatted(false)}
                        >
                          Raw
                        </Button>
                      </ButtonGroup>
                      <Code
                        overflowWrap="anywhere"
                        maxH="xs"
                        overflowY="auto"
                        whiteSpace="pre-wrap"
                      >
                        {isFormatted
                          ? JSON.stringify(
                              parsed,
                              (_, value) =>
                                typeof value === "bigint"
                                  ? value.toString()
                                  : value, // return everything else unchanged
                              2
                            )
                          : tx.input}
                      </Code>
                    </Stack>
                  }
                />
              </>
            );
          })()
        )}
      </Section>
    </>
  );
};
