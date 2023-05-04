import {
  useReactTable,
  TableOptions,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  Table as MuiTable,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from '@mui/material';
import { useState } from 'react';

type MockData = {
  name: string;
};

export interface TableProps {
  data: MockData[];
}

const DEFAULT_COLUMNS: Array<ColumnDef<MockData>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

export function Table({ data }: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns: DEFAULT_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <TableContainer>
      <MuiTable>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();

                  return (
                    <TableCell key={header.id}>
                      <TableSortLabel
                        active={!!isSorted}
                        direction={typeof isSorted === 'string' ? isSorted : undefined}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
