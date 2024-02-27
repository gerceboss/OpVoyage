import { chains } from "@/constants/web3";
import { ITxCountStats } from "@/interfaces/stats";
import theme from "@/themes";
import {
  Box,
  Card,
  Circle,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  useBreakpointValue,
} from "@chakra-ui/react";
import _ from "lodash";
import moment from "moment";
import numbro from "numbro";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChainCheckboxTable } from "../HomePage/ChainCheckboxTable";

interface IPivotedData {
  timestamp: number;
  relatedTransactionCount: number;
  allTransactionCount: number;
  [chainId: number]: {
    relatedTransactionCount: number;
    allTransactionCount: number;
  };
}

const StatCard = ({ label, number }: { label: string; number: number }) => {
  return (
    <Card
      as={Stack}
      spacing={0}
      p={2}
      h="fit-content"
      w={["full", "fit-content"]}
    >
      <Text>{label}</Text>
      <Text fontSize="2xl" as="b">
        {numbro(number).format({ thousandSeparated: true })}
      </Text>
    </Card>
  );
};

export const TxCountChart = ({ stats }: { stats: ITxCountStats[] }) => {
  const data = useMemo(() => {
    const pivotedData: IPivotedData[] = [];
    const reversedStats = stats.slice().reverse();
    // skip first timestamp
    let latestTimestamp = 0;
    for (const stat of reversedStats.slice(chains.length, -chains.length)) {
      const { timestamp, chainId, transactionCount, totalTransactionCount } =
        stat;
      // timestamp a chainId 1 transactionCount x1 totalTransactionCount y1
      // timestamp a chainId 2 transactionCount x2 totalTransactionCount y2
      // timestamp b chainId 1 transactionCount x3 totalTransactionCount y3
      // timestamp b chainId 2 transactionCount x4 totalTransactionCount y4
      // to
      // timestamp a relatedTransactionCount x1+x2 allTransactionCount y1+y2 { chainId1: { relatedTransactionCount: x1, allTransactionCount: y1 }, chainId2: { relatedTransactionCount: x2, allTransactionCount: y2 } }

      const pivotedIndex =
        timestamp === latestTimestamp ? pivotedData.length - 1 : null;
      if (pivotedIndex === null) {
        pivotedData.push({
          timestamp,
          relatedTransactionCount: transactionCount,
          allTransactionCount: totalTransactionCount,
          [chainId]: {
            relatedTransactionCount: transactionCount,
            allTransactionCount: totalTransactionCount,
          },
        });
        latestTimestamp = timestamp;
      } else {
        pivotedData[pivotedIndex].relatedTransactionCount += transactionCount;
        pivotedData[pivotedIndex].allTransactionCount += totalTransactionCount;
        pivotedData[pivotedIndex][chainId] = {
          relatedTransactionCount: transactionCount,
          allTransactionCount: totalTransactionCount,
        };
      }
    }

    return pivotedData;
  }, [stats]);

  const ticks = useBreakpointValue([100, 40, 20]);

  const total = {
    id: 0,
    color: theme["colors"]["primary"]["400"],
    lightColor: theme["colors"]["primary"]["100"],
    name: "",
    icon: undefined,
  };
  const [selected, setSelected] = useState<
    { key: string; color: string; label: string }[]
  >([
    {
      key: "allTransactionCount",
      color: theme["colors"]["primary"]["100"],
      label: "All Txs",
    },
    {
      key: "relatedTransactionCount",
      color: theme["colors"]["primary"]["400"],
      label: "Related Txs",
    },
  ]);

  const txStats = useMemo(() => {
    let all = 0;
    let related = 0;
    const latestDay = moment(stats[0].timestamp * 1000);
    for (const stat of stats) {
      if (moment(stat.timestamp * 1000).isSame(latestDay, "day")) {
        all += stat.totalTransactionCount;
        related += stat.transactionCount;
      }
    }
    return { all, related };
  }, [stats]);

  const Table = (
    <ChainCheckboxTable
      chains={[total, ...chains]}
      selected={selected}
      setSelected={setSelected}
      w={[42, 32]}
    />
  );
  const isMobile = useBreakpointValue([true, false]);

  return (
    <Stack spacing={2}>
      <HStack>
        <Wrap w="full">
          <StatCard label="Total Transaction Today" number={txStats.all} />
          <StatCard
            label="Related Transaction Today"
            number={txStats.related}
          />
        </Wrap>
        {isMobile && Table}
      </HStack>
      <HStack>
        {!isMobile && Table}
        <Stack w="100%">
          <Wrap fontSize={["sm", "md"]} spacingX={2} spacingY={0}>
            {selected.map((c) => (
              <HStack key={c.key}>
                <Circle size={2} bg={c.color} />
                <Text>{c.label}</Text>
              </HStack>
            ))}
          </Wrap>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <YAxis
                  fontSize="12px"
                  width={30}
                  tickFormatter={(v) => numbro(v).format({ average: true })}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(v) => moment(v * 1000).format("D/M, HH:mm")}
                  interval={ticks}
                  fontSize="12px"
                  height={20}
                />
                <CartesianGrid strokeDasharray="10 10" opacity={0.15} />
                <Tooltip
                  content={(e) => {
                    const { payload, label } = e;
                    return (
                      <Stack spacing={0} p={1} as={Card}>
                        <Text>{moment(label * 1000).format("D/M, HH:mm")}</Text>
                        <SimpleGrid columns={2} spacingX={2}>
                          {payload?.map((p) => (
                            <HStack key={p.dataKey}>
                              <Circle bg={p.color} size={2} />
                              <Text>
                                {numbro(p.value).format({
                                  thousandSeparated: true,
                                })}
                              </Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </Stack>
                    );
                  }}
                />
                {selected.map((c) => (
                  <Line
                    key={c.key}
                    type="monotone"
                    dataKey={c.key}
                    stroke={c.color}
                    dot={false}
                    activeDot={{
                      strokeWidth: 0,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </HStack>
    </Stack>
  );
};
