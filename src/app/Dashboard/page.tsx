"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Users, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";

import { getEmployees } from "@/lib/employees";
import { getAttendanceStats } from "@/lib/attendance";
import { getPendingLeaveRequests } from "@/lib/leaves";
import { useEffect, useState } from "react";
import { eventEmitter, EVENTS } from "@/lib/events";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    attendanceToday: 0,
    pendingLeaves: 0
  });

  const updateDashboardData = () => {
    const today = new Date().toISOString().split("T")[0];
    const stats = getAttendanceStats(today);
    
    setDashboardData({
      totalEmployees: getEmployees().length,
      attendanceToday: stats.percentage,
      pendingLeaves: getPendingLeaveRequests().length
    });
  };

  useEffect(() => {
    updateDashboardData();
    
    const unsubscribe = eventEmitter.subscribe(EVENTS.ATTENDANCE_UPDATED, updateDashboardData);
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Dashboard
        </h2>
        <p className="text-slate-400">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Total Employees
            </CardTitle>
            <Users className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{dashboardData.totalEmployees}</div>
            <p className="text-sm text-slate-400">
              Active employees
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Today's Attendance
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{dashboardData.attendanceToday}%</div>
            <p className="text-sm text-slate-400">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Pending Leaves
            </CardTitle>
            <FileText className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">{dashboardData.pendingLeaves}</div>
            <p className="text-sm text-slate-400">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {isAdmin && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-200">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  <Link href="/employees">View All Employees</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  <Link href="/attendance">Check Attendance</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  <Link href="/leaves">Manage Leaves</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-200">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {getEmployees().slice(0, 3).map((emp, i) => (
                    <div key={emp.id} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-300">{emp.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {i === 0 ? "Checked in" : i === 1 ? "Submitted report" : "Updated profile"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-800 bg-slate-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-200">Department Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Engineering", "HR", "Marketing"].map((dept) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{dept}</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-16 rounded-full bg-slate-700">
                        <div 
                          className="h-full rounded-full bg-indigo-500" 
                          style={{ 
                            width: `${dept === "Engineering" ? "75" : dept === "HR" ? "45" : "60"}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {dept === "Engineering" ? "75%" : dept === "HR" ? "45%" : "60%"}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
