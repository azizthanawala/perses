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
  Box,
  Typography,
} from '@mui/material';
import { useState, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

type MockData = {
  name: string;
  value: number;
  color?: string;
};

export interface TableProps {
  data: MockData[];
}

const DEFAULT_COLUMNS: Array<ColumnDef<MockData>> = [
  {
    // TODO: figure out disabling the sort icon/sorting for this one.
    id: 'rowSelect',
    enableSorting: false,
    enableResizing: false,
    size: 100,
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
      const color = row.original.color;

      return (
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          // color={row.original.color}
          sx={{
            color: color,
            '&.Mui-checked': {
              color: color,
            },
          }}
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
  // {
  //   id: 'emptyRight',
  //   header: '',
  // },
];

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
    columnResizeMode: 'onChange',
    state: {
      sorting,
      rowSelection,
    },
  });

  const rows = table.getRowModel().rows;

  // These actions would let us do things to a chart based on mouseover.
  function handleMouseOverRow(index: number) {
    const row = rows[index];
    if (row) {
      console.log(`mouseover row idx ${index}, id ${row.id}`);
    }
  }

  function handleMouseOutRow(index: number) {
    const row = rows[index];
    if (row) {
      console.log(`mouseout row idx ${index}, id ${row.id}`);
    }
  }

  const VirtuosoTableComponents: TableComponents<MockData> = {
    Scroller: forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
    Table: (props) => (
      <MuiTable
        {...props}
        size="small"
        sx={{ borderCollapse: 'separate', tableLayout: 'fixed', width: table.getCenterTotalSize() }}
      />
    ),
    TableHead,
    TableRow: ({ item, ...props }) => {
      const index = props['data-index'];
      return (
        <TableRow
          {...props}
          onMouseOver={() => handleMouseOverRow(index)}
          onMouseOut={() => handleMouseOutRow(index)}
          sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.background.default,
            },
          }}
        />
      );
    },
    TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
  };

  return (
    <Box style={{ height: 400, width: '100%' }}>
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
                      const canResize = header.column.getCanResize();
                      const isResizing = header.column.getIsResizing();
                      console.log(`canResize: ${canResize}`);

                      const cellContent = flexRender(header.column.columnDef.header, header.getContext());

                      return (
                        <TableCell
                          key={header.id}
                          sx={{
                            backgroundColor: 'background.paper',
                            position: 'relative',
                            width: header.getSize(),
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
                          {/* TODO: make the handles on this nicer, so the cursor doesn't flicker */}
                          {canResize && (
                            <Box
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                height: '100%',
                                padding: 2,
                                userSelect: 'none',
                                cursor: 'col-resize',
                                '&:hover': {
                                  ' > div': {
                                    backgroundColor: (theme) => theme.palette.text.primary,
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor: (theme) => theme.palette.divider,
                                  width: 2,
                                  height: '100%',
                                  cursor: 'col-resize',
                                }}
                              />
                            </Box>
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
                return (
                  <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
                    <Typography noWrap>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Typography>
                  </TableCell>
                );
              })}
            </>
          );
        }}
      />
    </Box>
  );
}
