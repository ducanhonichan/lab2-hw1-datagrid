
import type { ColumnDef, DataGridProps } from './data-grid-contract';

interface Employee {
  id: number;
  name: string;
  department: string;
}

const validColumn: ColumnDef<Employee> = {
  header: 'Employee Name',
  accessorKey: 'name',
  sortable: true,
};

const invalidColumn: ColumnDef<Employee> = {
  header: 'Salary',
  // @ts-expect-error: 'salary' is not a key of Employee
  accessorKey: 'salary',
};

const validGrid: DataGridProps<Employee> = {
  data: [
    { id: 1, name: 'Anna', department: 'IT' },
  ],
  columns: [validColumn],
  ariaLabel: 'Employee data grid',
  onRowSelect: (employee) => {
    console.log(employee.name);
  },
};

void invalidColumn;
void validGrid;
