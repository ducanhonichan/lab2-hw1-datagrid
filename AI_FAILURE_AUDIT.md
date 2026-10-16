
# AI Failure Audit – Homework 1

## Project Information

- Project: Enterprise Employee Data Grid
- Technology: React, TypeScript, Vite
- Objective: Identify, verify, and manually correct three issues in AI-suggested code.
- Verification tools: Chrome DevTools, TypeScript Compiler, Lighthouse.

---

## Issue 1 – Incorrect Keyboard Tab Navigation

### 1. AI-Suggested Implementation

The initial implementation assigned `tabIndex={0}` to every data cell.

```tsx
<td tabIndex={0}>
  {String(item[column.accessorKey] ?? '')}
</td>
```

### 2. Problem Identified

Every cell became part of the browser's sequential Tab order.

As a result, users had to press Tab repeatedly to move through the entire Data-Grid instead of using arrow keys for internal navigation.

### 3. Detection Method

Manual keyboard testing in Chrome DevTools.

The issue was observed during HW1.21–HW1.23.

### 4. Manual Correction

Implemented roving tabindex so that only the active cell has `tabIndex={0}`.

Other cells receive `tabIndex={-1}`.

```tsx
tabIndex={
  focusedCell.row === rowIndex &&
  focusedCell.col === colIndex
    ? 0
    : -1
}
```

The active cell is updated through keyboard navigation and focus events.

### 5. Verification

- Tab enters the Data-Grid through one active cell.
- Arrow keys move between cells.
- Tab exits the Data-Grid without visiting every cell.
- Shift + Tab supports reverse navigation.

### 6. Evidence

- HW1_21_GridCellFocus.png
- HW1_22_ArrowKeyNavigation.png
- HW1_23_RovingTabindex.png

Status: Corrected and manually verified.

---


## Issue 2 – Roving Tabindex Lost Row Identity After Sorting

### 1. AI-Suggested Implementation

The initial implementation tracked the active grid cell
using only its row and column indexes.

```tsx
const [focusedCell, setFocusedCell] = useState({
  row: 0,
  col: 0,
});
```

The cell's tabindex was determined by its position:

```tsx
tabIndex={
  focusedCell.row === rowIndex &&
  focusedCell.col === colIndex
    ? 0
    : -1
}
```

### 2. Problem Identified

When the user sorted the Data-Grid, the row order changed,
but the stored row index remained unchanged.

For example, the active cell originally belonged to
Linh Pham. After sorting by Full Name, the same row index
pointed to Hana Vo.

The keyboard entry point therefore no longer followed
the original employee.

### 3. Detection Method

Manual keyboard testing and Chrome DevTools inspection.

The issue was identified in HW1.33.

### 4. Manual Correction

Introduced a stable row identifier to track the active employee.

```tsx
const [focusedRowId, setFocusedRowId] =
  useState<string | null>(null);

const focusedRowIndex = paginatedData.findIndex(
  (item) => getItemId(item) === focusedRowId
);

const activeRowIndex =
  focusedRowIndex >= 0
    ? focusedRowIndex
    : Math.min(
        focusedCell.row,
        Math.max(0, paginatedData.length - 1)
      );
```

Updated the cell's tabindex to use `activeRowIndex`
instead of the original row index.

The active employee ID is updated when a cell receives focus.

### 5. Verification

- TypeScript compilation passed.
- ESLint passed.
- After sorting, the current page retained a keyboard entry point.
- When Minh Tran moved to a different row on the same page,
  the cell containing Minh Tran retained `tabindex="0"`.

### 6. Evidence

- HW1_33_SortingFocusIssue.png
- HW1_34_SortingFocusFix.png
- HW1_35_SortingFocusByID.png

Status: Corrected and manually verified for the tested scenarios.




---

## Issue 3 – Duplicate Search Input IDs Across DataGrid Instances

### 1. AI-Suggested Implementation

The initial DataGrid implementation used a hard-coded HTML ID for its search input and label.

```tsx
<label htmlFor="grid-search">Search employees</label>
<input id="grid-search" type="search" />
```

### 2. Problem Identified

When two DataGrid components were rendered on the same page, both search inputs received the same ID (`grid-search`).

HTML IDs must be unique within a document. Duplicate IDs can cause incorrect label associations and accessibility issues.

### 3. Detection Method

A second DataGrid instance was temporarily added to `App.tsx`.

Chrome DevTools Console was used to execute:

```js
document.querySelectorAll('#grid-search').length
```

The result was `2`, confirming that two elements shared the same ID.

### 4. Manual Correction

Replaced the hard-coded ID with React's `useId()` hook.

```tsx
import { useId, useMemo, useRef, useState } from 'react';

const searchId = useId();
```

Updated the label and input to use the generated ID:

```tsx
<label htmlFor={searchId}>Search employees</label>
<input id={searchId} type="search" />
```

Each DataGrid instance now generates its own unique ID while maintaining the correct label-input association.

### 5. Verification

- TypeScript compilation passed.
- ESLint passed.
- Two search inputs were rendered successfully.
- The original hard-coded ID was no longer present.
- Both search inputs had distinct IDs.
- Each search input had a corresponding label.

### 6. Evidence

- HW1_37_DuplicateSearchID.png
- HW1_38_UniqueSearchIDFix.png

Status: Corrected and manually verified.
