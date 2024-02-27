import { ILatestTransaction, TransactionType } from "@/interfaces/transaction";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { formatEther } from "viem";
import { getChain } from "@/constants/web3";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";
import { useSince } from "@/hooks/useSince";
import { LatestCard } from "../HomePage/LatestCard";
import numbro from "numbro";

export const LatestTransactionCard = ({
  index,
  ...tx
}: { index: number } & ILatestTransaction) => {
  const since = useSince(tx.block_timestamp * 1000);

  return (
    <LatestCard prefix="Tx" chainId={tx.chain_id} index={index}>
      <HStack>
        <HexHighlightBadge as="b" isTx>
          {tx.transaction_hash}
        </HexHighlightBadge>
        <Badge colorScheme={tx.error ? "red" : "green"}>
          {tx.error ?? "Success"}
        </Badge>
        {tx.ec_pairing_count > 0 && (
          <Badge colorScheme={TransactionType.ZK.colorScheme}>
            {TransactionType.ZK.label}
          </Badge>
        )}
        {tx.ec_recover_addresses.length > 0 && (
          <Badge colorScheme={TransactionType.RECOVER.colorScheme}>
            {TransactionType.RECOVER.label}
          </Badge>
        )}
      </HStack>
      <HStack>
        <Badge colorScheme="yellow" variant="outline">
          From
        </Badge>
        <HexHighlightBadge isAccount>{tx.from_address}</HexHighlightBadge>
        <Badge colorScheme="blue" variant="outline">
          To
        </Badge>
        <HexHighlightBadge isAccount>{tx.to_address}</HexHighlightBadge>
      </HStack>
      {tx.ec_recover_addresses.length > 0 && (
        <HStack fontSize="sm">
          <Text color={TransactionType.RECOVER.colorScheme}>
            Related{" "}
            <HexHighlightBadge isAccount>
              {tx.ec_recover_addresses[0]}
            </HexHighlightBadge>
          </Text>
          {tx.ec_recover_addresses.length > 1 && (
            <Badge colorScheme={TransactionType.RECOVER.colorScheme}>
              +{tx.ec_recover_addresses.length - 1}
            </Badge>
          )}
        </HStack>
      )}
      <HStack fontSize={["xs", null, "sm"]}>
        <Text as="i" color="gray.200">
          Block{" "}
          <HexHighlightBadge isBlock={tx.chain_id}>
            {tx.block_number}
          </HexHighlightBadge>{" "}
          Since {since}
        </Text>
        <Badge>
          {numbro(formatEther(tx.value)).format({
            mantissa: 4,
            optionalMantissa: true,
            thousandSeparated: true,
          })}{" "}
          {getChain(tx.chain_id)?.nativeCurrency.symbol}
        </Badge>
      </HStack>
    </LatestCard>
  );
};
