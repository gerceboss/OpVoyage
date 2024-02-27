import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { AppHeader, Section } from "@/components/common";
import { ITag } from "@/interfaces/tag";
import { getTagAddresses } from "@/services/tag";
import {
  Button,
  ButtonGroup,
  HStack,
  Heading,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { TagBadge, TagsBadge } from "@/components/Badge/TagBadge";
import _ from "lodash";
import { setCacheHeader } from "@/utils/header";

interface ITagPageProps {
  tag: string;
  tags: ITag[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 1 hours
  setCacheHeader(context.res, 3600);

  const { tag } = context.params as { tag: string };
  const sanitizedTag = tag.replaceAll("-", " ");
  const { page: p } = context.query;
  const page = p ? parseInt(p as string) : 1;
  const tags = await getTagAddresses(sanitizedTag, page - 1);
  return {
    props: {
      tag: sanitizedTag,
      tags,
    },
  };
}) satisfies GetServerSideProps<ITagPageProps>;

export const TagPage = ({ tag, tags }: ITagPageProps) => {
  const router = useRouter();
  const page = useMemo(
    () => parseInt(router.query.page as string) || 1,
    [router.query.page]
  );

  const tagLength = tags?.length || 0;

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ITag>();
    return [
      columnHelper.accessor("address", {
        header: "Address",
        cell: (row) => {
          const isFull = useBreakpointValue([false, true]);
          return (
            <HexHighlightBadge isFull={isFull} isAccount>
              {row.getValue()}
            </HexHighlightBadge>
          );
        },
      }),
      columnHelper.accessor("tags", {
        header: "Tags",
        cell: (row) => <TagsBadge tags={_.uniq(row.getValue())} isLink />,
      }),
    ];
  }, []);

  const table = useReactTable({
    columns,
    data: tags || [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.address,
  });

  return (
    <>
      <AppHeader title={`Tag ${tag}`} />
      <Section>
        <Heading display="flex" alignItems="center" gap={2}>
          Tag
          <TagBadge tag={tag} />
        </Heading>
        <Heading size="lg">Contracts/Addresses</Heading>
        <HStack justify="end">
          <ButtonGroup size="sm" variant="outline">
            <IconButton
              icon={<Icon as={LuChevronLeft} />}
              aria-label="Back"
              isDisabled={page <= 1}
              onClick={() => router.push(`/tag/${tag}?page=${page - 1}`)}
            />
            <Button pointerEvents="none">{page}</Button>
            <IconButton
              icon={<Icon as={LuChevronRight} />}
              aria-label="Back"
              isDisabled={page > 10 || tagLength < 50}
              onClick={() => router.push(`/tag/${tag}?page=${page + 1}`)}
            />
          </ButtonGroup>
        </HStack>
        <AnimatedTable table={table} />
      </Section>
    </>
  );
};
