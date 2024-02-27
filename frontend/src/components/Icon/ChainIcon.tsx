import { getChain } from "@/constants/web3";
import { Image, ImageProps } from "@chakra-ui/react";

export const ChainIcon = ({
  chainId,
  ...props
}: { chainId: number } & ImageProps) => {
  const icon = getChain(chainId)?.icon;

  return <Image boxSize={4} src={icon} {...props} />;
};
