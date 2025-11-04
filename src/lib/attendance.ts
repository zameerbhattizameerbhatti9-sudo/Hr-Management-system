import { AttendanceRecord } from "@/types";
import { getEmployees } from "./employees";

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  // Adding initial attendance records for today
  {
    id: "a1",
    employeeId: "1",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a2",
    employeeId: "2",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a3",
    employeeId: "3",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a4",
    employeeId: "4",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a5",
    employeeId: "5",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a6",
    employeeId: "6",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a7",
    employeeId: "7",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a8",
    employeeId: "8",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a9",
    employeeId: "9",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a10",
    employeeId: "10",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a11",
    employeeId: "11",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a12",
    employeeId: "12",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a13",
    employeeId: "13",
    date: "2025-11-03",
    status: "present",
  },
  {
    id: "a14",
    employeeId: "14",
    date: "2025-11-03",
    status: "present",
  }
];

// Initialize today's attendance
function initializeTodayAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const employees = getEmployees();

  employees.forEach((employee) => {
    if (!MOCK_ATTENDANCE.find((a) => 
      a.employeeId === employee.id && a.date === today
    )) {
      MOCK_ATTENDANCE.push({
        id: Math.random().toString(36).substr(2, 9),
        employeeId: employee.id,
        date: today,
        status: "absent",
      });
    }
  });
}

export function getAttendance(date: string): AttendanceRecord[] {
  if (date === new Date().toISOString().split("T")[0]) {
    initializeTodayAttendance();
  }
  return MOCK_ATTENDANCE.filter((record) => record.date === date);
}

import { eventEmitter, EVENTS } from "./events";

export function markAttendance(
  employeeId: string, 
  date: string, 
  status: "present" | "absent" | "late" | "half-day" | "wfh",
  checkIn?: string,
  checkOut?: string
): AttendanceRecord {
  const existing = MOCK_ATTENDANCE.find(
    (a) => a.employeeId === employeeId && a.date === date
  );

  if (existing) {
    existing.status = status;
    if (checkIn) existing.checkIn = checkIn;
    if (checkOut) existing.checkOut = checkOut;
    eventEmitter.emit(EVENTS.ATTENDANCE_UPDATED);
    return existing;
  }

  const newRecord: AttendanceRecord = {
    id: Math.random().toString(36).substr(2, 9),
    employeeId,
    date,
    status,
    checkIn,
    checkOut,
  };

  MOCK_ATTENDANCE.push(newRecord);
  eventEmitter.emit(EVENTS.ATTENDANCE_UPDATED);
  return newRecord;
}

export function getAttendanceStats(date: string): {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  wfh: number;
  percentage: number;
} {
  const records = getAttendance(date);
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const halfDay = records.filter((r) => r.status === "half-day").length;
  const wfh = records.filter((r) => r.status === "wfh").length;
  const percentage = total === 0 ? 0 : Math.round(((present + late + halfDay * 0.5 + wfh) / total) * 100);

  return {
    total,
    present,
    absent,
    late,
    halfDay,
    wfh,
    percentage,
  };
}