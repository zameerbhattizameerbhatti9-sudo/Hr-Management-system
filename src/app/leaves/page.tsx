"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { LeaveRequest } from "@/types";
import { getLeaveRequests, addLeaveRequest, updateLeaveRequestStatus } from "@/lib/leaves";
import { getEmployees } from "@/lib/employees";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeaveRequestWithEmployeeName = LeaveRequest & { employeeName: string };

export default function LeavesPage() {
  const [requests, setRequests] = useState<LeaveRequestWithEmployeeName[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  const loadLeaveRequests = () => {
    const employees = getEmployees();
    const leaves = getLeaveRequests();
    
    const requestsWithNames = leaves.map((request) => ({
      ...request,
      employeeName: employees.find((e) => e.id === request.employeeId)?.name || "Unknown",
    }));

    setRequests(requestsWithNames);
  };

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const handleSubmitLeave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (!user) return;

    const request = {
      employeeId: user.id,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      reason: formData.get("reason") as string,
      type: formData.get("type") as "sick" | "vacation" | "personal",
    };

    addLeaveRequest(request);
    loadLeaveRequests();
    setIsDialogOpen(false);
  };

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    updateLeaveRequestStatus(id, status);
    loadLeaveRequests();
  };

  const isAdmin = user?.role === "admin";

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Requests</h2>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage employee leave requests" : "Submit and track your leave requests"}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Request Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitLeave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Leave Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input id="reason" name="reason" required />
                </div>
                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests
              .filter((request) => isAdmin || request.employeeId === user?.id)
              .map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.employeeName}
                  </TableCell>
                  <TableCell className="capitalize">{request.type}</TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString()} -{" "}
                    {new Date(request.endDate).toLocaleDateString()}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {request.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  {isAdmin && request.status === "pending" && (
                    <TableCell>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(request.id, "rejected")}
                        >
                          Reject
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