"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getSalarySlip, getDepartmentSalaryStats } from "@/lib/salary";
import { getEmployees } from "@/lib/employees";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function SalaryPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>(user?.id || "");
  const [salaryData, setSalaryData] = useState<any>(null);
  const [departmentStats, setDepartmentStats] = useState<any>(null);

  const employees = getEmployees();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (selectedEmployee) {
      const slip = getSalarySlip(selectedEmployee, selectedMonth, selectedYear);
      setSalaryData(slip);
    }

    if (isAdmin) {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee) {
        const stats = getDepartmentSalaryStats(employee.department);
        setDepartmentStats(stats);
      }
    }
  }, [selectedEmployee, selectedMonth, selectedYear, isAdmin]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Salary Management</h2>
        <p className="text-muted-foreground">View and manage salary information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Month</Label>
          <select
            className="w-full p-2 border rounded-md mt-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Year</Label>
          <select
            className="w-full p-2 border rounded-md mt-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        {isAdmin && (
          <div>
            <Label>Employee</Label>
            <select
              className="w-full p-2 border rounded-md mt-1"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {salaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Salary Slip</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span>${salaryData.basicSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>HRA:</span>
                <span>${salaryData.allowances.hra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport Allowance:</span>
                <span>${salaryData.allowances.transport.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Deduction:</span>
                <span>-${salaryData.deductions.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Absence Deduction:</span>
                <span>-${salaryData.deductions.absences.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Net Salary:</span>
                <span>${salaryData.netSalary.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {isAdmin && departmentStats && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Department Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Employees:</span>
                  <span>{departmentStats.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Salary:</span>
                  <span>${departmentStats.averageSalary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary Range:</span>
                  <span>${departmentStats.salaryRange.min.toFixed(0)} - ${departmentStats.salaryRange.max.toFixed(0)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
