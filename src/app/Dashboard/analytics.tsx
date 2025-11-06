"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDepartmentStatistics } from "@/lib/employees";
import { getAttendanceStats } from "@/lib/attendance";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function DashboardAnalytics() {
  const [departmentStats, setDepartmentStats] = useState<any>({});
  const [attendanceData, setAttendanceData] = useState<any>(null);

  useEffect(() => {
    // Get statistics for main departments
    const departments = ["Engineering", "Human Resources", "Product", "Design", "Marketing"];
    const stats = departments.reduce((acc, dept) => {
      acc[dept] = getDepartmentStatistics(dept);
      return acc;
    }, {} as any);
    setDepartmentStats(stats);

    // Get attendance data
    const today = new Date();
    const attendanceStats = getAttendanceStats(today.toISOString());
    setAttendanceData(attendanceStats);
  }, []);

  const departmentChartData = {
    labels: Object.keys(departmentStats),
    datasets: [
      {
        label: "Average Salary",
        data: Object.values(departmentStats).map((stat: any) => stat.averageSalary),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
      {
        label: "Total Employees",
        data: Object.values(departmentStats).map((stat: any) => stat.totalEmployees),
        backgroundColor: "rgba(147, 51, 234, 0.5)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Present:</span>
              <span className="text-green-500 font-medium">
                {attendanceData?.present || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Absent:</span>
              <span className="text-red-500 font-medium">
                {attendanceData?.absent || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Half Day:</span>
              <span className="text-yellow-500 font-medium">
                {attendanceData?.halfDay || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Department Overview</h3>
          <div className="space-y-2">
            {Object.entries(departmentStats).map(([dept, stats]: [string, any]) => (
              <div key={dept} className="flex justify-between">
                <span>{dept}:</span>
                <span className="font-medium">{stats.totalEmployees}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Employees:</span>
              <span className="font-medium">
                {Object.values(departmentStats).reduce(
                  (sum: number, stat: any) => sum + stat.totalEmployees,
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Departments:</span>
              <span className="font-medium">{Object.keys(departmentStats).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Attendance:</span>
              <span className="font-medium">
                {attendanceData
                  ? Math.round(
                      (attendanceData.present /
                        (attendanceData.present +
                          attendanceData.absent +
                          attendanceData.halfDay)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Department Analytics</h3>
        <div className="h-[300px]">
          <Bar
            data={departmentChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
}