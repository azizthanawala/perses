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
  Header,
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
import { MockData } from './Table';

export interface TableHeaderCellProps {
  header: Header<MockData, unknown>;
}

export function TableHeaderCell({ header }: TableHeaderCellProps) {
  const isSorted = header.column.getIsSorted();
  const canSort = header.column.getCanSort();
  const canResize = header.column.getCanResize();
  const isResizing = header.column.getIsResizing();
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
}
