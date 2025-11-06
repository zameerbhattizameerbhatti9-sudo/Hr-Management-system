export type UserRole = 'admin' | 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position?: string;
}

export interface Employee extends User {
  joinDate: string;
  department: string;
  salary: number;
  managerId?: string;
  skills: string[];
  documents: EmployeeDocument[];
  leaveBalance: LeaveBalance;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  type: 'contract' | 'certificate' | 'id' | 'policy' | 'form' | 'report' | 'other';
  title: string;
  url: string;
  expiryDate?: string;
  uploadDate: string;
  status?: 'active' | 'archived' | 'draft';
  category?: string;
  tags?: string[];
  description?: string;
  version?: string;
  accessLevel?: 'all' | 'manager' | 'hr' | 'personal';
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  carryOver: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'wfh';
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'sick' | 'vacation' | 'personal' | 'unpaid';
  approvedBy?: string;
  approvalDate?: string;
  attachments?: string[];
}

export interface Performance {
  id: string;
  employeeId: string;
  reviewerId: string;
  date: string;
  type: 'quarterly' | 'annual' | 'probation';
  ratings: {
    technical: number;
    communication: number;
    teamwork: number;
    leadership: number;
    overall: number;
  };
  goals: PerformanceGoal[];
  comments: string;
  nextReviewDate: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  category: 'professional' | 'personal' | 'technical' | 'soft-skills';
}

export interface Training {
  id: string;
  title: string;
  description: string;
  type: 'internal' | 'external' | 'certification' | 'workshop';
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  instructor?: string;
  maxParticipants: number;
  participants: TrainingParticipant[];
  budget?: number;
  skills: string[];
}

export interface TrainingParticipant {
  employeeId: string;
  status: 'enrolled' | 'completed' | 'dropped';
  enrollmentDate: string;
  completionDate?: string;
  score?: number;
  certificate?: string;
}

export interface HolidayCalendar {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'company' | 'optional';
  description?: string;
}