"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  getTrainings,
  getEmployeeTrainings,
  addTraining,
  enrollParticipant,
  updateParticipantStatus,
} from "@/lib/training";
import { Training, TrainingParticipant } from "@/types";

export default function TrainingPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Training["status"]>();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      setTrainings(getTrainings(selectedStatus));
    } else if (user) {
      setTrainings(getEmployeeTrainings(user.id));
    }
  }, [isAdmin, selectedStatus, user]);

  const handleAddTraining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const training: Omit<Training, "id"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as any,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: "upcoming",
      instructor: formData.get("instructor") as string,
      maxParticipants: Number(formData.get("maxParticipants")),
      participants: [],
      budget: Number(formData.get("budget")),
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()),
    };

    const newTraining = addTraining(training);
    setTrainings([...trainings, newTraining]);
    setIsAddTrainingOpen(false);
  };

  const handleEnroll = async (trainingId: string) => {
    try {
      if (!user) return;

      await enrollParticipant(trainingId, {
        employeeId: user.id,
      });

      // Refresh trainings list
      if (isAdmin) {
        setTrainings(getTrainings(selectedStatus));
      } else {
        setTrainings(getEmployeeTrainings(user.id));
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
      // Handle error (show notification, etc.)
    }
  };

  const handleUpdateStatus = async (
    trainingId: string,
    employeeId: string,
    status: TrainingParticipant["status"],
    completionData?: Partial<TrainingParticipant>
  ) => {
    try {
      await updateParticipantStatus(trainingId, employeeId, status, completionData);

      // Refresh trainings list
      if (isAdmin) {
        setTrainings(getTrainings(selectedStatus));
      } else if (user) {
        setTrainings(getEmployeeTrainings(user.id));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Training Management</h2>
          <p className="text-muted-foreground">
            Browse and manage training programs
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-4">
            <select
              className="border rounded-md p-2"
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value as any || undefined)}
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Button onClick={() => setIsAddTrainingOpen(true)}>
              Add Training
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">{training.title}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-slate-100 capitalize">
                {training.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {training.description}
            </p>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="capitalize">{training.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>
                  {new Date(training.startDate).toLocaleDateString()} -{" "}
                  {new Date(training.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>
                  {training.participants.length}/{training.maxParticipants}
                </span>
              </div>
              {training.instructor && (
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span>{training.instructor}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!isAdmin && training.status === "upcoming" && (
                <Button
                  className="w-full"
                  onClick={() => handleEnroll(training.id)}
                  disabled={
                    training.participants.some((p) => p.employeeId === user?.id)
                  }
                >
                  Enroll
                </Button>
              )}

              {isAdmin && training.participants.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Participants</h4>
                  <div className="space-y-2">
                    {training.participants.map((participant) => (
                      <div
                        key={participant.employeeId}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{participant.employeeId}</span>
                        <select
                          className="text-sm border rounded-md p-1"
                          value={participant.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              training.id,
                              participant.employeeId,
                              e.target.value as any
                            )
                          }
                        >
                          <option value="enrolled">Enrolled</option>
                          <option value="completed">Completed</option>
                          <option value="dropped">Dropped</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Training Dialog */}
      <Dialog open={isAddTrainingOpen} onOpenChange={setIsAddTrainingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Training Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTraining} className="space-y-4">
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
              <Label>Type</Label>
              <select name="type" className="w-full p-2 border rounded-md">
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="certification">Certification</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input name="startDate" type="date" required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input name="endDate" type="date" required />
            </div>
            <div>
              <Label>Instructor</Label>
              <Input name="instructor" />
            </div>
            <div>
              <Label>Maximum Participants</Label>
              <Input name="maxParticipants" type="number" required />
            </div>
            <div>
              <Label>Budget</Label>
              <Input name="budget" type="number" />
            </div>
            <div>
              <Label>Skills (comma-separated)</Label>
              <Input name="skills" placeholder="e.g., JavaScript, React, Node.js" />
            </div>
            <Button type="submit" className="w-full">
              Add Training
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}