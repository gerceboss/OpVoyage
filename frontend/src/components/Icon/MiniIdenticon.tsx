import { Image, ImageProps } from "@chakra-ui/react";
import { blo } from "blo";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";

export const MiniIdenticon = ({
  src,
  address,
  ...props
}: {
  src?: string;
  address: Address;
} & ImageProps) => {
  const svgURI = useMemo(() => {
    return blo(address);
  }, [address]);

  return <Image src={src || svgURI} alt={address} {...props} />;
};
