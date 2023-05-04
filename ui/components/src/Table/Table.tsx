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
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

type MockData = {
  name: string;
  value: number;
};

export interface TableProps {
  data: MockData[];
}

const DEFAULT_COLUMNS: Array<ColumnDef<MockData>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
];

const VirtuosoTableComponents: TableComponents<MockData> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <MuiTable {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

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

  const rows = table.getRowModel().rows;

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        totalCount={rows.length}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => {
          return (
            <>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSorted = header.column.getIsSorted();

                      return (
                        <TableCell
                          key={header.id}
                          sx={{
                            backgroundColor: 'background.paper',
                          }}
                        >
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
            </>
          );
        }}
        itemContent={(index) => {
          const row = rows[index];
          if (!row) {
            return null;
          }

          return (
            <>
              {row.getVisibleCells().map((cell) => {
                return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
              })}
            </>
          );
        }}
      />
    </Paper>
  );
}
