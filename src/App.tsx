
import './App.css';
import { DataGrid } from './components/DataGrid';
import type { ColumnDef } from './types/data-grid-contract';

interface Employee {
  id: number;
  name: string;
  department: string;
}

const employees: Employee[] = [
  { id: 1, name: 'Anna Nguyen', department: 'IT' },
  { id: 2, name: 'Minh Tran', department: 'Finance' },
  { id: 3, name: 'Linh Pham', department: 'HR' },
  { id: 4, name: 'David Le', department: 'Operations' },
  { id: 5, name: 'Hana Vo', department: 'Marketing' },
];

const columns: ColumnDef<Employee>[] = [
  { header: 'Employee ID', accessorKey: 'id', sortable: true },
  { header: 'Full Name', accessorKey: 'name', sortable: true },
  { header: 'Department', accessorKey: 'department', sortable: true },
];

function App() {
  return (
    <main>
      <h1>Enterprise Employee Data Grid</h1>

      <p>Employee directory with accessible table structure.</p>

      <DataGrid<Employee>
  data={employees}
  columns={columns}
  ariaLabel="Employee directory"
  getRowId={(employee) => employee.id}
/>




    </main>
  );
}

export default App;
