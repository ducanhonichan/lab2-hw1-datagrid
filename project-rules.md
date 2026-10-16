
# Project Rules – Lab 02 Homework 1

## 1. Project Objective
Build a Production Enterprise Data-Grid following the
Lab 02 Homework 1 specification.

## 2. Development Workflow
Follow the 4-stage AI decomposition pipeline:

1. Functional Slicing
2. Contract-First Specification
3. Atomic Generation
4. Independent Verification

Implement and verify one isolated task at a time.

## 3. TypeScript Contract
Define the following generic interfaces before
implementing the Data-Grid:

- ColumnDef<T>
- DataGridProps<T>

Preserve the required properties and types from
the instructor's data-grid-contract.ts example.

## 4. Data-Grid Features
The component must support:

- Column sorting
- Data filtering
- Pagination
- Row selection

## 5. Accessibility Requirements
- Target WCAG 2.2 Level AA.
- Maintain text contrast of at least 4.5:1
  where applicable.
- Support screen readers.
- Support Arrow Up, Down, Left, Right navigation.
- Enter selects; Space toggles.
- Use semantic table elements.
- Implement and verify required ARIA grid semantics.
- Target verified Lighthouse scores of 100/100
  for Accessibility and Best Practices.

## 6. Code Integrity
- Avoid unsafe innerHTML for untrusted data.
- Avoid deprecated or insecure coding patterns.
- Prevent event listener leaks.
- Avoid unstable React keys.
- Do not claim a test passed without evidence.

## 7. Submission Evidence
- Maintain atomic Git commits.
- Capture screenshots of implementation and tests.
- Record verified AI-generated issues and fixes.
- Keep project documentation updated.

## 8. Verification Rule
All accessibility, keyboard navigation, sorting,
filtering, pagination, and Lighthouse claims must
be independently tested.
