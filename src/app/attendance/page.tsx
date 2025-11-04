"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getEmployees } from "@/lib/employees";
import { getAttendance, markAttendance, getAttendanceStats } from "@/lib/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, UserX } from "lucide-react";

type AttendanceData = {
  id: string;
  name: string;
  status: "present" | "absent" | "late" | "half-day" | "wfh";
};

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    wfh: 0,
    percentage: 0,
  });
  const { user } = useAuth();

  const loadAttendance = () => {
    const employees = getEmployees();
    const attendance = getAttendance(date);
    
    const data = employees.map((employee) => {
      const record = attendance.find((a) => a.employeeId === employee.id);
      return {
        id: employee.id,
        name: employee.name,
        status: record?.status || "absent",
      };
    });

    setAttendanceData(data);
    setStats(getAttendanceStats(date));
  };

  useEffect(() => {
    loadAttendance();
  }, [date]);

  const handleMarkAttendance = (employeeId: string, status: "present" | "absent" | "late" | "half-day" | "wfh") => {
    markAttendance(employeeId, date, status);
    loadAttendance();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Track daily employee attendance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            id="date"
            className="w-fit"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Present Today
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.percentage}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              {user?.role === "admin" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : record.status === "absent"
                        ? "bg-red-100 text-red-800"
                        : record.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : record.status === "half-day"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {record.status === "wfh" 
                      ? "WFH"
                      : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </TableCell>
                {user?.role === "admin" && (
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(record.id, "present")}
                        disabled={record.status === "present"}
                      >
                        Mark Present
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(record.id, "absent")}
                        disabled={record.status === "absent"}
                      >
                        Mark Absent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAttendance(record.id, "wfh")}
                        disabled={record.status === "wfh"}
                      >
                        Mark WFH
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
