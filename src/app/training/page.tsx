"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as any || undefined)}
            >
              <SelectTrigger className="w-[180px] bg-background text-foreground">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddTrainingOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add Training
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="p-6 bg-card text-card-foreground hover:bg-accent/5 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-foreground">{training.title}</h3>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                training.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                training.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {training.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {training.description}
            </p>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize text-foreground">{training.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">
                  {new Date(training.startDate).toLocaleDateString()} -{" "}
                  {new Date(training.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Participants:</span>
                <span className="font-medium text-foreground">
                  {training.participants.length}/{training.maxParticipants}
                </span>
              </div>
              {training.instructor && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium text-foreground">{training.instructor}</span>
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
                        <Select
                          value={participant.status}
                          onValueChange={(value) =>
                            handleUpdateStatus(
                              training.id,
                              participant.employeeId,
                              value as any
                            )
                          }
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="dropped">Dropped</SelectItem>
                          </SelectContent>
                        </Select>
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
              <Select name="type" defaultValue="internal">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
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