import { ILatestBlock } from "@/interfaces/block";
import { Badge, HStack, Text } from "@chakra-ui/react";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";
import { useSince } from "@/hooks/useSince";
import { LatestCard } from "../HomePage/LatestCard";

export const LatestBlockCard = ({
  index,
  ...block
}: { index: number } & ILatestBlock) => {
  const since = useSince(block.timestamp * 1000);

  return (
    <LatestCard prefix="Bk" chainId={block.chain_id} index={index}>
      <HStack>
        <HexHighlightBadge isBlock={block.chain_id}>
          {block.number}
        </HexHighlightBadge>
        <Badge>{block.transaction_count} Txs</Badge>
        <Badge colorScheme="pink">
          {block.related_transaction_count} Related Txs
        </Badge>
      </HStack>
      <Text>
        Hash <HexHighlightBadge>{block.hash}</HexHighlightBadge>
      </Text>
      <Text as="i" color="gray.200" fontSize={["xs", null, "sm"]}>
        Since {since}
      </Text>
    </LatestCard>
  );
};
