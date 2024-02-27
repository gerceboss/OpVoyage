import { HStack, Stack, Text } from "@chakra-ui/react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";
import { ReactNode, isValidElement } from "react";

export const WrapItem = ({
  title,
  value,
  tooltip,
  suffix,
}: {
  title: ReactNode;
  value: ReactNode;
  tooltip?: string;
  suffix?: ReactNode;
}) => {
  return (
    <Stack spacing={0}>
      <HStack as="b">
        <Text whiteSpace="pre-wrap">{title}</Text>
        {tooltip && <InfoTooltip msg={tooltip} />}
        {suffix && suffix}
      </HStack>
      {isValidElement(value) ? value : <Text fontSize="xl">{value}</Text>}
    </Stack>
  );
};
