import {
  Box,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Table as TTable, flexRender } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";

export const AnimatedTable = <T,>({
  table,
  ...props
}: { table: TTable<T> } & TableProps) => {
  return (
    <Box overflowX="auto" w="full">
      <Table {...props}>
        <Thead>
          {table.getHeaderGroups().map((h) => (
            <Tr key={h.id}>
              {h.headers.map((c) => (
                <Th key={c.id} colSpan={c.colSpan}>
                  {c.isPlaceholder
                    ? null
                    : flexRender(c.column.columnDef.header, c.getContext())}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          <AnimatePresence>
            {table.getRowModel().rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: i * 0.02,
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
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </Tbody>
      </Table>
    </Box>
  );
};
