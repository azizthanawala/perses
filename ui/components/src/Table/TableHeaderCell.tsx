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
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useRef, useState } from 'react';
import DotsVerticalIcon from 'mdi-material-ui/DotsVertical';
import { MockData } from './Table';

export interface TableHeaderCellProps {
  header: Header<MockData, unknown>;
}

export function TableHeaderCell({ header }: TableHeaderCellProps) {
  // const tableCellRef = useRef<HTMLElement | null>(null);
  // const isMenuOpen = useState<boolean>(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const { column } = header;

  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const canResize = column.getCanResize();
  const isResizing = column.getIsResizing();
  const cellContent = flexRender(column.columnDef.header, header.getContext());

  const hasMenu = canSort;

  const handleClickMenuButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

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
      {hasMenu && (
        <>
          <IconButton size="small" onClick={handleClickMenuButton}>
            <DotsVerticalIcon fontSize="inherit" />
          </IconButton>
          <Menu open={!!menuAnchorEl} anchorEl={menuAnchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={column.clearSorting} disabled={!isSorted}>
              Unsort
            </MenuItem>
            <MenuItem onClick={() => column.toggleSorting(false)} disabled={isSorted === 'asc'}>
              Sort by ASC
            </MenuItem>
            <MenuItem onClick={() => column.toggleSorting(true)} disabled={isSorted === 'desc'}>
              Sort by DESC
            </MenuItem>
          </Menu>
        </>
      )}
    </TableCell>
  );
}
