import { LeaveRequest } from "@/types";

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "2",
    startDate: "2025-11-10",
    endDate: "2025-11-12",
    reason: "Family vacation",
    status: "pending",
    type: "vacation",
  },
  {
    id: "2",
    employeeId: "3",
    startDate: "2025-11-15",
    endDate: "2025-11-16",
    reason: "Medical appointment",
    status: "approved",
    type: "sick",
  },
];

export function getLeaveRequests(): LeaveRequest[] {
  return MOCK_LEAVE_REQUESTS;
}

export function addLeaveRequest(request: Omit<LeaveRequest, "id" | "status">): LeaveRequest {
  const newRequest = {
    ...request,
    id: Math.random().toString(36).substr(2, 9),
    status: "pending" as const,
  };
  
  MOCK_LEAVE_REQUESTS.push(newRequest);
  return newRequest;
}

export function updateLeaveRequestStatus(
  id: string,
  status: "approved" | "rejected"
): LeaveRequest {
  const request = MOCK_LEAVE_REQUESTS.find((r) => r.id === id);
  if (!request) throw new Error("Leave request not found");

  request.status = status;
  return request;
}

export function getEmployeeLeaveRequests(employeeId: string): LeaveRequest[] {
  return MOCK_LEAVE_REQUESTS.filter((r) => r.employeeId === employeeId);
}

export function getPendingLeaveRequests(): LeaveRequest[] {
  return MOCK_LEAVE_REQUESTS.filter((r) => r.status === "pending");
}