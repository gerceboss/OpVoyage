import { Badge, BadgeProps } from "@chakra-ui/react";
import numbro from "numbro";

export const PercentageBadge = ({
  value,
  mantissa,
  ...props
}: { value: number; mantissa?: number } & BadgeProps) => {
  return (
    <Badge
      {...props}
      colorScheme={
        value < 0.25
          ? "red"
          : value < 0.5
          ? "orange"
          : value < 0.75
          ? "yellow"
          : "green"
      }
    >
      {numbro(value).format({
        optionalMantissa: true,
        mantissa: mantissa || 2,
        output: "percent",
      })}
    </Badge>
  );
};
