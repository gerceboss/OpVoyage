import {
  Badge,
  Button,
  HStack,
  Heading,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";
import { LuChevronDown } from "react-icons/lu";
import { chains, getChain } from "@/constants/web3";
import { TagBadge } from "../Badge/TagBadge";
import numbro from "numbro";
import { IAggregatedTag, IChainTags } from "@/interfaces/tag";
import { useMemo, useState } from "react";
import _ from "lodash";

export const DiscoverTagSection = ({ tags }: { tags: IChainTags[] }) => {
  const [selected, setSelected] = useState<string[]>(
    chains.map((c) => c.id.toString())
  );
  const selectedTags = useMemo(() => {
    const filteredTags = tags.filter((t) =>
      selected.includes(t.chain_id.toString())
    );
    return _.sortBy(
      filteredTags.reduce((acc, t) => {
        t.tags.forEach((tag) => {
          const index = acc.findIndex((a) => a.tag === tag.tag);
          if (index === -1) {
            acc.push({ ...tag });
          } else {
            acc[index].count += tag.count;
          }
        });
        return acc;
      }, [] as IAggregatedTag[]),
      (t) => -t.count
    );
  }, [selected, tags]);

  return (
    <Stack>
      <HStack justify="space-between">
        <HStack>
          <Heading size="md">Discover Tags</Heading>
          <InfoTooltip msg="Discover related contracts by our tags" />
        </HStack>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={LuChevronDown} />}
            size="sm"
          >
            {selected.length === 0
              ? "None"
              : selected.length === 1
              ? getChain(Number(selected[0]))?.name
              : selected.length === chains.length
              ? "All Chains"
              : "Multiple Chains"}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="checkbox"
              title="Chains"
              onChange={(v) => setSelected(Array.isArray(v) ? v : [v])}
              value={selected}
            >
              {chains.map((c) => (
                <MenuItemOption key={c.id} value={c.id.toString()}>
                  <HStack>
                    <Image src={c.icon} boxSize={4} alt={c.name} />
                    <Text>{c.name}</Text>
                  </HStack>
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </HStack>
      <Wrap fontSize={["md", "lg"]}>
        {selectedTags.map((t) => (
          <Badge py={1} px={1} fontSize={["sm", "md"]} key={t.tag}>
            {numbro(t.count).format({ thousandSeparated: true })}{" "}
            <TagBadge key={t.tag} tag={t.tag} cursor="pointer" isLink />
          </Badge>
        ))}
      </Wrap>
    </Stack>
  );
};
