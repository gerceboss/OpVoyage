import { BoxProps, Container, Stack, StackProps } from "@chakra-ui/react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const SectionContainer = (props: BoxProps) => {
  return (
    <Container
      minH="100dvh"
      maxW="container.xl"
      mx="auto"
      px={[6, 10, 20]}
      {...props}
    />
  );
};

export const Section = (props: StackProps) => {
  return (
    <SectionContainer>
      <Navbar />
      <Stack spacing={4} {...props} />
      <Footer />
    </SectionContainer>
  );
};
