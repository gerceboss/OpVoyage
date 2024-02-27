import {
  Badge,
  BadgeProps,
  ChakraComponent,
  Wrap,
  WrapProps,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useMemo } from "react";
import uniqolor from "uniqolor";
import tinycolor from "tinycolor2";
import { create } from "zustand";
import Link from "next/link";

const useHighlight = create<{
  highlight: string | null;
  setHighlight: (hex: string) => void;
  clearHighlight: () => void;
}>((set) => ({
  highlight: null,
  setHighlight: (hex) => set({ highlight: hex }),
  clearHighlight: () => set({ highlight: null }),
}));

export const TagsBadge = ({
  tags,
  isLink,
  fallback,
  badgeProps,
  ...props
}: {
  tags?: string[];
  isLink?: boolean;
  fallback?: JSX.Element;
  badgeProps?: BadgeProps;
} & WrapProps) => {
  if (!tags?.length) return fallback || null;
  return (
    <Wrap {...props}>
      {tags.map((t, i) => (
        <TagBadge
          tag={t}
          key={i}
          fontSize={props.fontSize}
          {...badgeProps}
          isLink={isLink}
        />
      ))}
    </Wrap>
  );
};

type TagBadgeComponent = ChakraComponent<
  "div",
  {
    tag: string;
    isLink?: boolean;
  }
>;

export const TagBadge = (({
  tag,
  isLink,
  builder,
  ...props
}: {
  tag: string;
  isLink?: boolean;
  builder?: (tag: string) => ReactNode;
} & BadgeProps) => {
  const { highlight, setHighlight, clearHighlight } = useHighlight();

  const [c, bg, hoverBg, clickBg] = useMemo(() => {
    const c = uniqolor(tag, {
      saturation: [40, 65],
      lightness: [55, 65],
    }).color;
    return [
      tinycolor(c).brighten().toString(),
      tinycolor(c).setAlpha(0.2).toString(),
      tinycolor(c).setAlpha(0.3).toString(),
      tinycolor(c).setAlpha(0.25).toString(),
    ] as const;
  }, []);

  useEffect(() => {
    return () => clearHighlight();
  }, []);

  return (
    <Badge
      color={c}
      bg={bg}
      fontSize="inherit"
      _hover={{
        bg: hoverBg,
      }}
      _active={{
        bg: clickBg,
      }}
      transform={highlight === tag ? "scale(1.2)" : "scale(1)"}
      transition="all 0.2s ease-in-out"
      border="0.1em dashed"
      borderColor={
        highlight === tag ? tinycolor(c).brighten().toString() : "transparent"
      }
      borderRadius="0.25em"
      width="fit-content"
      cursor={isLink ? "pointer" : "default"}
      onMouseEnter={() => setHighlight(tag)}
      onMouseLeave={clearHighlight}
      as={isLink ? Link : undefined}
      href={isLink ? `/tag/${tag}` : undefined}
      {...props}
    >
      {builder ? builder(tag) : tag}
    </Badge>
  );
}) as TagBadgeComponent;
