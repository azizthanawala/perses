import {
  useReactTable,
  TableOptions,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
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
  Checkbox,
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
    // TODO: figure out disabling the sort icon/sorting for this one.
    id: 'rowSelect',
    enableSorting: false,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      );
    },
  },
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns: DEFAULT_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      rowSelection,
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
                      const canSort = header.column.getCanSort();

                      const cellContent = flexRender(header.column.columnDef.header, header.getContext());

                      return (
                        <TableCell
                          key={header.id}
                          sx={{
                            backgroundColor: 'background.paper',
                          }}
                        >
                          {canSort ? (
                            <TableSortLabel
                              active={!!isSorted}
                              direction={typeof isSorted === 'string' ? isSorted : undefined}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {cellContent}
                            </TableSortLabel>
                          ) : (
                            cellContent
                          )}
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
