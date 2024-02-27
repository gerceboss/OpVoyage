import { Image, ImageProps } from "@chakra-ui/react";

export const MainLogo = (props: ImageProps) => {
  return <Image src="/logo.svg" alt="Logo" boxSize={6} {...props} />;
};
