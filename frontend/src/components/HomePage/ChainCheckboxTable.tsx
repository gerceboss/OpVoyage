import {
  Checkbox,
  Image,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import tinycolor from "tinycolor2";

export const ChainCheckboxTable = ({
  chains,
  selected,
  setSelected,
  ...tableProps
}: {
  selected: { key: string; color: string; label: string }[];
  setSelected: Dispatch<
    SetStateAction<{ key: string; color: string; label: string }[]>
  >;
  chains: {
    color: string;
    lightColor?: string;
    name: string;
    id: number;
    icon?: string;
  }[];
} & TableProps) => {
  return (
    <Table
      w="100%"
      h="100%"
      size="sm"
      sx={{
        th: {
          position: "relative",
          fontSize: "0.5rem",
        },
        "th, td": {
          whiteSpace: "nowrap",
          pl: 1,
          pr: 1,
        },
      }}
      {...tableProps}
    >
      <Thead>
        <Tr>
          <Th>
            <Text className="rt">All</Text>
          </Th>
          <Th>
            <Text className="rt">Related</Text>
          </Th>
          <Th>Chain</Th>
        </Tr>
      </Thead>
      <Tbody>
        {chains.map((c) => {
          const color = c.color;
          const lightColor =
            (c as any)?.lightColor ||
            tinycolor(color).saturate(20).lighten(20).toString();
          const key = c.id ? `${c.id}.` : "";
          return (
            <Tr key={c.id}>
              <Td>
                <Checkbox
                  _checked={{
                    "& .chakra-checkbox__control": {
                      background: lightColor,
                      "&:hover": {
                        background: tinycolor(lightColor).darken(5).toString(),
                      },
                      borderColor: "transparent",
                    },
                  }}
                  isChecked={
                    !!selected.find(
                      (e) => e.key === `${key}allTransactionCount`
                    )
                  }
                  onChange={(changed) => {
                    if (changed.target.checked) {
                      setSelected((prev) => [
                        ...prev,
                        {
                          key: `${key}allTransactionCount`,
                          color: lightColor,
                          label: c.name ? `${c.name} All Txs` : "All Txs",
                        },
                      ]);
                    } else {
                      setSelected((prev) =>
                        prev.filter(
                          (e) => e.key !== `${key}allTransactionCount`
                        )
                      );
                    }
                  }}
                />
              </Td>
              <Td>
                <Checkbox
                  _checked={{
                    "& .chakra-checkbox__control": {
                      background: color,
                      "&:hover": {
                        background: tinycolor(color).darken(5).toString(),
                      },
                      borderColor: "transparent",
                    },
                  }}
                  _hover={{
                    background: "whiteAlpha.100",
                  }}
                  isChecked={
                    !!selected.find(
                      (e) => e.key === `${key}relatedTransactionCount`
                    )
                  }
                  onChange={(changed) => {
                    if (changed.target.checked) {
                      setSelected((prev) => [
                        ...prev,
                        {
                          key: `${key}relatedTransactionCount`,
                          color,
                          label: c.name
                            ? `${c.name} Related Txs`
                            : "Related Txs",
                        },
                      ]);
                    } else {
                      setSelected((prev) =>
                        prev.filter(
                          (e) => e.key !== `${key}relatedTransactionCount`
                        )
                      );
                    }
                  }}
                />
              </Td>
              <Td>
                {c.icon ? <Image src={c.icon} boxSize={4} /> : <Text>All</Text>}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
