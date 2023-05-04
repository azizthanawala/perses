import {
  useReactTable,
  TableOptions,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Table as MuiTable, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

type MockData = {
  name: string;
};

export interface TableProps {
  data: MockData[];
}

const DEFAULT_COLUMNS: Array<ColumnDef<MockData>> = [
  {
    accessorKey: 'name',
  },
];

export function Table({ data }: TableProps) {
  const table = useReactTable({ data, columns: DEFAULT_COLUMNS, getCoreRowModel: getCoreRowModel() });
  console.log(table);

  return (
    <TableContainer>
      <MuiTable>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableCell key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
