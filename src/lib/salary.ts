import { Employee } from "@/types";
import { getAttendanceStats } from "./attendance";
import { getEmployees } from "./employees";

interface SalarySlip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  deductions: {
    tax: number;
    absences: number;
    other: number;
  };
  allowances: {
    hra: number;
    transport: number;
    other: number;
  };
  netSalary: number;
  generatedDate: string;
}

const MOCK_SALARY_SLIPS: SalarySlip[] = [];

export function calculateSalarySlip(
  employeeId: string,
  month: number,
  year: number
): SalarySlip {
  const employee = getEmployees().find((e) => e.id === employeeId);
  if (!employee) throw new Error("Employee not found");

  // Calculate working days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const workingDays = daysInMonth - 8; // Excluding weekends (approximate)

  // Get attendance for the month
  const date = new Date(year, month, 1);
  const attendanceStats = getAttendanceStats(date.toISOString().split("T")[0]);

  // Calculate deductions
  const perDayPay = employee.salary / workingDays;
  const absenceDeduction = (attendanceStats.absent + (attendanceStats.halfDay * 0.5)) * perDayPay;
  const taxRate = 0.2; // 20% tax rate
  const taxDeduction = (employee.salary * taxRate) / 12;

  // Calculate allowances
  const hraRate = 0.4; // 40% of basic as HRA
  const hra = (employee.salary * hraRate) / 12;
  const transportAllowance = 1500;

  const salarySlip: SalarySlip = {
    id: Math.random().toString(36).substr(2, 9),
    employeeId: employee.id,
    month,
    year,
    basicSalary: employee.salary / 12,
    deductions: {
      tax: taxDeduction,
      absences: absenceDeduction,
      other: 0,
    },
    allowances: {
      hra,
      transport: transportAllowance,
      other: 0,
    },
    netSalary:
      (employee.salary / 12) +
      hra +
      transportAllowance -
      taxDeduction -
      absenceDeduction,
    generatedDate: new Date().toISOString(),
  };

  MOCK_SALARY_SLIPS.push(salarySlip);
  return salarySlip;
}

export function getSalarySlip(
  employeeId: string,
  month: number,
  year: number
): SalarySlip | undefined {
  return (
    MOCK_SALARY_SLIPS.find(
      (slip) =>
        slip.employeeId === employeeId &&
        slip.month === month &&
        slip.year === year
    ) || calculateSalarySlip(employeeId, month, year)
  );
}

export function getEmployeeSalaryHistory(employeeId: string): SalarySlip[] {
  return MOCK_SALARY_SLIPS.filter((slip) => slip.employeeId === employeeId);
}

export function getDepartmentSalaryStats(department: string) {
  const employees = getEmployees().filter((e) => e.department === department);
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  
  return {
    totalEmployees: employees.length,
    averageSalary: totalSalary / employees.length,
    totalSalary,
    salaryRange: {
      min: Math.min(...employees.map((e) => e.salary)),
      max: Math.max(...employees.map((e) => e.salary)),
    },
  };
}