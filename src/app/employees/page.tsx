"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/types";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/lib/employees";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const { user } = useAuth();

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];

  // Filter employees based on search and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  useEffect(() => {
    // Get employees and ensure no duplicates by using a Map with id as key
    const uniqueEmployees = new Map(
      getEmployees().map(emp => [emp.id, emp])
    );
    setEmployees(Array.from(uniqueEmployees.values()));
  }, []);

  const handleAddEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const employeeData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: "employee" as const,
      position: formData.get("position") as string,
      department: formData.get("department") as string,
      joinDate: new Date().toISOString().split("T")[0],
      salary: Number(formData.get("salary")),
      skills: [], // Initialize with empty skills array
      documents: [], // Initialize with empty documents array
      leaveBalance: {
        annual: 20, // Default values for leave balance
        sick: 10,
        personal: 5,
        carryOver: 0
      }
    };

    const added = addEmployee(employeeData);
    
    // Update employees ensuring no duplicates
    setEmployees(prevEmployees => {
      const uniqueEmployees = new Map(
        [...prevEmployees, added].map(emp => [emp.id, emp])
      );
      return Array.from(uniqueEmployees.values());
    });
    
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedEmployee) return;

    const formData = new FormData(event.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
      department: formData.get("department") as string,
      salary: Number(formData.get("salary")),
    };

    const updated = updateEmployee(selectedEmployee.id, updatedData);
    setEmployees(employees.map((emp) => (emp.id === updated.id ? updated : emp)));
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            Manage your company employees here
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" name="position" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Employee
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, position, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full bg-transparent hover:bg-accent/10">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Join Date</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  {new Date(employee.joinDate).toLocaleDateString()}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <form onSubmit={handleEditEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={selectedEmployee.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={selectedEmployee.email}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  name="position"
                  defaultValue={selectedEmployee.position}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  name="department"
                  defaultValue={selectedEmployee.department}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary</Label>
                <Input
                  id="edit-salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="1000"
                  defaultValue={selectedEmployee.salary}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
