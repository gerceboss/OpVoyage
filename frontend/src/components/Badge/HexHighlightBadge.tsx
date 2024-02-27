import { formatAddress } from "@/utils/address";
import { formatHex } from "@/utils/string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  TextProps,
  chakra,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import { create } from "zustand";

const useHighlight = create<{
  highlight: string | null;
  setHighlight: (hex: string) => void;
  clearHighlight: () => void;
}>((set) => ({
  highlight: null,
  setHighlight: (hex) => set({ highlight: hex }),
  clearHighlight: () => set({ highlight: null }),
}));

export const HexHighlightBadge = ({
  href,
  children,
  isFull,
  wrap,
  isBlock,
  isTx,
  isAccount,
  ...props
}: TextProps & {
  href?: string;
  isFull?: boolean;
  wrap?: boolean;
  isBlock?: number;
  isTx?: boolean;
  isAccount?: boolean;
}) => {
  const { highlight, setHighlight, clearHighlight } = useHighlight();
  const highlightColor = useColorModeValue("yellow.600", "yellow.300");

  const isHighlighted = children?.toString() === highlight;
  const isExpanded =
    isFull ||
    (children?.toString().startsWith("0x") && children?.toString().length > 12);
  const isLink = href !== undefined || isBlock || isTx || isAccount;

  useEffect(() => {
    return () => clearHighlight();
  }, []);

  return (
    <Popover
      trigger="hover"
      isLazy
      openDelay={0}
      returnFocusOnClose={false}
      computePositionOnMount={false}
      autoFocus={false}
      eventListeners={false}
      isOpen={isExpanded ? undefined : false}
    >
      <PopoverTrigger>
        <chakra.span
          transition="0.2s ease-in-out all"
          onMouseEnter={
            children ? () => setHighlight(children.toString()) : undefined
          }
          onMouseLeave={clearHighlight}
          border="1px dashed"
          borderRadius="md"
          w="fit-content"
          overflowWrap={wrap ? "anywhere" : "inherit"}
          {...props}
          color={isHighlighted ? highlightColor : props.color || "inherit"}
          cursor={
            isHighlighted && isLink ? "pointer" : props.cursor || "default"
          }
          borderColor={
            isHighlighted ? highlightColor : props.borderColor || "transparent"
          }
          as={isLink ? Link : undefined}
          href={
            href ||
            (isBlock
              ? `/block?chainId=${isBlock}&number=${children}`
              : isTx
              ? `/tx/${children}`
              : isAccount
              ? `/address/${children}`
              : undefined)
          }
        >
          {typeof children === "string"
            ? !children.startsWith("0x") || children.length < 12 || isFull
              ? children
              : children.length > 44
              ? formatHex(children)
              : formatAddress(children)
            : children}
          {
            //isHighlighted && (
            //<chakra.span
            //display="inline-block"
            //verticalAlign={-2}
            //pl={1}
            //onClick={() => {
            //toast({
            //title: "Copied",
            //status: "success",
            //});
            //window.navigator.clipboard.writeText(children);
            //}}
            //>
            //<Icon as={LuCopy} boxSize={3} />
            //</chakra.span>
            //)
          }
        </chakra.span>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content">
          <Text p={1}>{children}</Text>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
