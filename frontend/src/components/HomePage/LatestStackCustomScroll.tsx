import { Stack, StackProps } from "@chakra-ui/react";

export const LatestStackCustomScroll = (props: StackProps) => {
  return (
    <Stack
      h={["xl", "2xl"]}
      overflowY="hidden"
      overflowX="hidden"
      position="relative"
      sx={{
        "::-webkit-scrollbar": {
          WebkitAppearance: "none",
          width: "4px",
          bg: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          bg: "gray",
        },
      }}
      _after={{
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: "30%",
        background: "blackAlpha.300",
        backdropFilter: "blur(20px)",
        mask: "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)",
        pointerEvents: "none",
      }}
      spacing={0}
      {...props}
    />
  );
};
