
import { useId, useMemo, useRef, useState } from 'react';

import type { KeyboardEvent } from 'react';

import type { DataGridProps } from '../types/data-grid-contract';

type SortDirection = 'asc' | 'desc';

export function DataGrid<T extends object>({
  data,
  columns,
  ariaLabel,
  getRowId,
  onRowSelect,
}: DataGridProps<T>) {

    const searchId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const pageSize = 3;
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc');




    
const filteredData = useMemo(() => {
  const query = searchQuery.trim().toLocaleLowerCase();

  if (!query) {
    return data;
  }

  return data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessorKey] ?? '')
        .toLocaleLowerCase()
        .includes(query)
    )
  );
}, [data, columns, searchQuery]);

  const sortedData = useMemo(() => {
    if (sortKey === null) {
  return filteredData;
}

return [...filteredData].sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];

      const comparison =
        typeof first === 'number' && typeof second === 'number'
          ? first - second
          : String(first ?? '').localeCompare(String(second ?? ''));

      return sortDirection === 'asc' ? comparison : -comparison;
    });
 }, [filteredData, sortKey, sortDirection]);




 
const totalPages = Math.max(
  1,
  Math.ceil(sortedData.length / pageSize)
);

const safeCurrentPage = Math.min(currentPage, totalPages);

const paginatedData = useMemo(() => {
  const startIndex = (safeCurrentPage - 1) * pageSize;

  return sortedData.slice(startIndex, startIndex + pageSize);
}, [sortedData, safeCurrentPage]);





const tableRef = useRef<HTMLTableElement>(null);
const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

const [focusedCell, setFocusedCell] = useState({
  row: 0,
  col: 0,
});


const [focusedRowId, setFocusedRowId] = useState<string | null>(null);

function getItemId(item: T): string {
  return getRowId
    ? String(getRowId(item))
    : String(item[columns[0].accessorKey]);
}

const focusedRowIndex = paginatedData.findIndex(
  (item) => getItemId(item) === focusedRowId
);

const activeRowIndex =
  focusedRowIndex >= 0
    ? focusedRowIndex
    : Math.min(focusedCell.row, Math.max(0, paginatedData.length - 1));



function handleCellKeyDown(
  event: KeyboardEvent<HTMLTableCellElement>,
  rowIndex: number,
  colIndex: number
) {




    
if (event.key === 'Enter' || event.key === ' ') {
  event.preventDefault();

  const item = paginatedData[rowIndex];
  if (!item) return;

  const rowId = getRowId
    ? String(getRowId(item))
    : String(item[columns[0].accessorKey]);

  if (event.key === 'Enter') {
    setSelectedRowId(rowId);
    onRowSelect?.(item);
  } else {
    const isSelected = selectedRowId === rowId;

    setSelectedRowId(isSelected ? null : rowId);

    if (!isSelected) {
      onRowSelect?.(item);
    }
  }

  return;
}

  let nextRow = rowIndex;
  let nextCol = colIndex;

  switch (event.key) {
    case 'ArrowUp':
      nextRow--;
      break;
    case 'ArrowDown':
      nextRow++;
      break;
    case 'ArrowLeft':
      nextCol--;
      break;
    case 'ArrowRight':
      nextCol++;
      break;
    default:
      return;
  }

  const rowCount = paginatedData.length;
  const colCount = columns.length;

  if (
    nextRow < 0 ||
    nextRow >= rowCount ||
    nextCol < 0 ||
    nextCol >= colCount
  ) {
    return;
  }

event.preventDefault();

setFocusedCell({
  row: nextRow,
  col: nextCol,
});

const rows = tableRef.current?.tBodies[0]?.rows;
const nextCell = rows?.[nextRow]?.cells[nextCol];

nextCell?.focus();
}

  function handleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }

  return (
  <div>
    <label htmlFor={searchId}>Search employees</label>
    <input
     id={searchId}
      type="search"
      value={searchQuery}
      
onChange={(event) => {
  setSearchQuery(event.target.value);
  setCurrentPage(1);
  setFocusedCell({ row: 0, col: 0 });
  setFocusedRowId(null);
}}


      placeholder="Search by name, ID or department"
    />

    <table
  ref={tableRef}
  role="grid"
  aria-label={ariaLabel}
  aria-multiselectable="false"
>

      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.accessorKey)}
              scope="col"
              aria-sort={
                column.accessorKey === sortKey
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              }
            >
              {column.sortable ? (
                <button
                  type="button"
                  onClick={() => handleSort(column.accessorKey)}
                >
                  {column.header}
                  {sortKey === column.accessorKey
                    ? sortDirection === 'asc'
                      ? ' ▲'
                      : ' ▼'
                    : ''}
                </button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        
{paginatedData.length === 0 && (
  <tr>
    <td
      colSpan={columns.length}
      role="gridcell"
      style={{ textAlign: 'center', padding: '24px' }}
    >
      No matching employees found.
    </td>
  </tr>
)}

        {paginatedData.map((item, rowIndex) => (
  <tr
  role="row"
  aria-selected={
  selectedRowId === (
    getRowId
      ? String(getRowId(item))
      : String(item[columns[0].accessorKey])
  )
}

    key={
      getRowId
        ? String(getRowId(item))
        : String(item[columns[0].accessorKey])
    }
  >
           
{columns.map((column, colIndex) => (
  
<td
  key={String(column.accessorKey)}
  role="gridcell"
  
tabIndex={
  activeRowIndex === rowIndex &&
  focusedCell.col === colIndex
    ? 0
    : -1
}

 onFocus={() => {
  setFocusedCell({
    row: rowIndex,
    col: colIndex,
  });
  setFocusedRowId(getItemId(item));
}}
  onKeyDown={(event) =>
    handleCellKeyDown(event, rowIndex, colIndex)
  }
>


    {String(item[column.accessorKey] ?? '')}
  </td>
))}

          </tr>
        ))}
      </tbody>
    </table>




    
<nav aria-label="Data grid pagination">
  <button
    type="button"
    disabled={safeCurrentPage === 1}
    onClick={() => {
  setCurrentPage(safeCurrentPage - 1);
  setFocusedCell({ row: 0, col: 0 });
  setFocusedRowId(null);
}}
  >
    Previous
  </button>

  <span aria-live="polite">
    {' '}Page {safeCurrentPage} of {totalPages}{' '}
  </span>

  <button
    type="button"
    disabled={safeCurrentPage === totalPages}
    onClick={() => {
  setCurrentPage(safeCurrentPage + 1);
  setFocusedCell({ row: 0, col: 0 });
  setFocusedRowId(null);
}}
  >
    Next
  </button>
</nav>

      </div>
  );
}
