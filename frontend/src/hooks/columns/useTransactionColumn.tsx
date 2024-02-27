import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { getChain } from "@/constants/web3";
import { ITransaction, TransactionType } from "@/interfaces/transaction";
import { Badge, HStack, Stack, Text } from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import numbro from "numbro";
import { useMemo } from "react";
import { formatEther } from "viem";

export const useTransactionColumn = <T extends ITransaction>(
  cFn?: () => { prefix?: ColumnDef<T, any>[]; suffix?: ColumnDef<T, any>[] }
): ColumnDef<T, any>[] => {
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ITransaction>();
    const { prefix = [], suffix = [] } = cFn ? cFn() : {};
    return [
      ...prefix,
      columnHelper.accessor((r) => [r.transaction_hash, r.error] as const, {
        header: "Hash",
        cell: (row) => {
          const [hash, error] = row.getValue();
          return (
            <Stack spacing={0} w="fit-content">
              <Badge colorScheme={error ? "red" : "green"}>
                {error || "Success"}
              </Badge>
              <HexHighlightBadge isTx>{hash}</HexHighlightBadge>
            </Stack>
          );
        },
      }),
      columnHelper.accessor((r) => [r.from_address, r.to_address] as const, {
        header: "From / To",
        cell: (row) => {
          const [from, to] = row.getValue();
          return (
            <Stack align="end" spacing={0} w="fit-content">
              <HStack>
                <Badge colorScheme="yellow" variant="outline">
                  From
                </Badge>
                <HexHighlightBadge isAccount>{from}</HexHighlightBadge>
              </HStack>
              <HStack>
                <Badge colorScheme="blue" variant="outline">
                  To
                </Badge>
                <HexHighlightBadge isAccount>{to}</HexHighlightBadge>
              </HStack>
            </Stack>
          );
        },
      }),
      columnHelper.accessor(
        (r) => [r.ec_pairing_count, r.ec_recover_addresses] as const,
        {
          header: "Type",
          cell: (row) => {
            const [pairingCount, addresses] = row.getValue();
            return (
              <Stack spacing={1}>
                <HStack>
                  {pairingCount > 0 && (
                    <Badge colorScheme={TransactionType.ZK.colorScheme}>
                      {TransactionType.ZK.label}
                    </Badge>
                  )}
                  {addresses.length > 0 && (
                    <Badge colorScheme={TransactionType.RECOVER.colorScheme}>
                      {TransactionType.RECOVER.label}
                    </Badge>
                  )}
                </HStack>
                {addresses.length > 0 && (
                  <HStack>
                    <HexHighlightBadge
                      color={TransactionType.RECOVER.colorScheme}
                      isAccount
                    >
                      {addresses[0]}
                    </HexHighlightBadge>
                    {addresses.length > 1 && (
                      <Badge colorScheme={TransactionType.RECOVER.colorScheme}>
                        +{addresses.length - 1}
                      </Badge>
                    )}
                  </HStack>
                )}
              </Stack>
            );
          },
        }
      ),
      columnHelper.accessor(
        (r) => [r.function_signature, r.function_name] as const,
        {
          header: "Function",
          cell: (row) => {
            const [signature, name] = row.getValue();
            const sterilizedName = name?.split("(")?.[0];
            return (
              <Text
                w="6rem"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                display="inline-block"
                overflow="hidden"
              >
                <HexHighlightBadge isFull>
                  {sterilizedName || signature}
                </HexHighlightBadge>
              </Text>
            );
          },
        }
      ),
      columnHelper.accessor((r) => [r.chain_id, r.value] as const, {
        header: "Value",
        cell: (row) => {
          const [chainId, value] = row.getValue();
          const chain = getChain(chainId);
          return (
            <Text>
              {numbro(formatEther(value)).format({
                thousandSeparated: true,
                mantissa: 4,
                optionalMantissa: true,
              })}{" "}
              {chain?.nativeCurrency.symbol}
            </Text>
          );
        },
      }),
      ...suffix,
    ];
  }, []);

  return columns as ColumnDef<T, any>[];
};
