import {
  DividerProps,
  ResponsiveValue,
  Divider as ChakraDivider,
  useBreakpointValue,
} from "@chakra-ui/react";

export const Divider = ({
  orientation: o,
  ...props
}: {
  orientation?: ResponsiveValue<"horizontal" | "vertical">;
} & DividerProps) => {
  const orientation = useBreakpointValue(o as any);
  return <ChakraDivider orientation={orientation} my={2} {...props} />;
};
