import {
  Box,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { LuInfo } from "react-icons/lu";

export const InfoTooltip = ({ msg }: { msg: string }) => {
  return (
    <Popover trigger="hover" isLazy>
      <PopoverTrigger>
        <chakra.span>
          <Icon as={LuInfo} fontSize="sm" />
        </chakra.span>
      </PopoverTrigger>
      <PopoverContent w="fit-content" fontWeight="normal">
        <PopoverArrow />
        <PopoverBody maxW="sm">{msg}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
