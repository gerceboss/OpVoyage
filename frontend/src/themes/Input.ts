import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

export const inputTheme = defineMultiStyleConfig({
  defaultProps: {
    // @ts-ignore
    focusBorderColor: "transparent",
  },
});
