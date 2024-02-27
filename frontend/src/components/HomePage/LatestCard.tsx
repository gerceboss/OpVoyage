import { Card, Circle, HStack, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChainIcon } from "../Icon/ChainIcon";
import { ReactNode } from "react";

export const LatestCard = ({
  prefix,
  chainId,
  index,
  children,
}: {
  prefix: string;
  chainId: number;
  index: number;
  children?: ReactNode | ReactNode[];
}) => {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        delay: index * 0.02,
        duration: 0.5,
      }}
      style={{
        backgroundColor: "var(--chakra-colors-whiteAlpha-0)",
      }}
      whileHover={{
        backgroundColor: "var(--chakra-colors-whiteAlpha-50)",
        transition: {
          duration: 0.2,
        },
      }}
    >
      <Card py={[1, null, 2]} bg="transparent">
        <HStack>
          <Circle bg="chakra-body-bg" size={12} pos="relative">
            {prefix}
            <ChainIcon
              chainId={chainId}
              boxSize={6}
              pos="absolute"
              right={2}
              bottom={2}
              transform="translate(50%, 50%)"
            />
          </Circle>
          <Stack spacing={0}>{children}</Stack>
        </HStack>
      </Card>
    </motion.div>
  );
};
