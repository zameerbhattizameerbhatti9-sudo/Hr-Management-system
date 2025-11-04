"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  getEmployeePerformance,
  getPerformanceStats,
  getEmployeeGoals,
  addPerformanceReview,
  addGoal,
  updateGoal,
} from "@/lib/performance";
import { getEmployees } from "@/lib/employees";
import { Performance, PerformanceGoal, Employee } from "@/types";

export default function PerformancePage() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const employees = getEmployees();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const empId = isAdmin ? selectedEmployee : user?.id;
    if (empId) {
      setPerformances(getEmployeePerformance(empId));
      setGoals(getEmployeeGoals(empId));
      setStats(getPerformanceStats(empId));
    }
  }, [isAdmin, selectedEmployee, user?.id]);

  const handleAddReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const review: Omit<Performance, "id"> = {
      employeeId: selectedEmployee || user?.id!,
      reviewerId: user?.id!,
      date: new Date().toISOString(),
      type: formData.get("type") as any,
      ratings: {
        technical: Number(formData.get("technical")),
        communication: Number(formData.get("communication")),
        teamwork: Number(formData.get("teamwork")),
        leadership: Number(formData.get("leadership")),
        overall: Number(formData.get("overall")),
      },
      goals: [],
      comments: formData.get("comments") as string,
      nextReviewDate: formData.get("nextReviewDate") as string,
    };

    const newReview = addPerformanceReview(review);
    setPerformances([...performances, newReview]);
    setIsAddReviewOpen(false);
  };

  const handleAddGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const goal: Omit<PerformanceGoal, "id"> = {
      employeeId: selectedEmployee || user?.id!,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      dueDate: formData.get("dueDate") as string,
      status: "not-started",
      progress: 0,
      category: formData.get("category") as any,
    };

    const newGoal = addGoal(goal);
    setGoals([...goals, newGoal]);
    setIsAddGoalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Management</h2>
          <p className="text-muted-foreground">
            Track and manage employee performance reviews and goals
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-4">
            <select
              className="border rounded-md p-2"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp: Employee) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <Button onClick={() => setIsAddReviewOpen(true)}>Add Review</Button>
            <Button onClick={() => setIsAddGoalOpen(true)}>Add Goal</Button>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Average Ratings</h3>
            <div className="space-y-2">
              {Object.entries(stats.averageRatings).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span>{(value as number).toFixed(1)}/5</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Goal Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Completed</span>
                <span>{stats.goalStats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress</span>
                <span>{stats.goalStats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Started</span>
                <span>{stats.goalStats.notStarted}</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue</span>
                <span>{stats.goalStats.overdue}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Performance Reviews</h3>
          <div className="space-y-4">
            {performances.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  <span className="capitalize">{review.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {review.comments}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(review.ratings).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span>{value}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.title}</span>
                  <span className="capitalize">{goal.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {goal.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span>Progress: {goal.progress}%</span>
                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Review Dialog */}
      <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Performance Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <Label>Type</Label>
              <select name="type" className="w-full p-2 border rounded-md">
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="probation">Probation</option>
              </select>
            </div>
            {["technical", "communication", "teamwork", "leadership", "overall"].map(
              (rating) => (
                <div key={rating}>
                  <Label className="capitalize">{rating}</Label>
                  <Input
                    name={rating}
                    type="number"
                    min="1"
                    max="5"
                    required
                  />
                </div>
              )
            )}
            <div>
              <Label>Comments</Label>
              <textarea
                name="comments"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <Label>Next Review Date</Label>
              <Input name="nextReviewDate" type="date" required />
            </div>
            <Button type="submit" className="w-full">
              Add Review
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <select name="category" className="w-full p-2 border rounded-md">
                <option value="professional">Professional</option>
                <option value="personal">Personal</option>
                <option value="technical">Technical</option>
                <option value="soft-skills">Soft Skills</option>
              </select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input name="startDate" type="date" required />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input name="dueDate" type="date" required />
            </div>
            <Button type="submit" className="w-full">
              Add Goal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}