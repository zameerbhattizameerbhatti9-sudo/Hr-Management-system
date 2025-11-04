import { Training, TrainingParticipant } from "@/types";

const MOCK_TRAININGS: Training[] = [
  {
    id: "1",
    title: "Advanced React Development",
    description: "Deep dive into React hooks, patterns, and performance optimization",
    type: "internal",
    startDate: "2023-11-15",
    endDate: "2023-12-15",
    status: "upcoming",
    instructor: "Thomas Wright",
    maxParticipants: 15,
    participants: [
      {
        employeeId: "1",
        status: "enrolled",
        enrollmentDate: "2023-10-25"
      },
      {
        employeeId: "4",
        status: "enrolled",
        enrollmentDate: "2023-10-26"
      }
    ],
    budget: 5000,
    skills: ["React", "JavaScript", "Performance Optimization"]
  },
  {
    id: "2",
    title: "Leadership and Management Skills",
    description: "Essential leadership skills for new managers",
    type: "workshop",
    startDate: "2023-10-01",
    endDate: "2023-10-31",
    status: "completed",
    instructor: "Lisa Thompson",
    maxParticipants: 10,
    participants: [
      {
        employeeId: "2",
        status: "completed",
        enrollmentDate: "2023-09-15",
        completionDate: "2023-10-31",
        score: 92,
        certificate: "/certificates/leadership-sarah.pdf"
      }
    ],
    budget: 3000,
    skills: ["Leadership", "Communication", "Team Management"]
  }
];

export function getTrainings(status?: Training["status"]): Training[] {
  if (status) {
    return MOCK_TRAININGS.filter((training) => training.status === status);
  }
  return MOCK_TRAININGS;
}

export function getEmployeeTrainings(employeeId: string): Training[] {
  return MOCK_TRAININGS.filter((training) =>
    training.participants.some((p) => p.employeeId === employeeId)
  );
}

export function addTraining(training: Omit<Training, "id">): Training {
  const newTraining = {
    ...training,
    id: Math.random().toString(36).substr(2, 9),
  };
  MOCK_TRAININGS.push(newTraining);
  return newTraining;
}

export function updateTraining(id: string, data: Partial<Training>): Training {
  const index = MOCK_TRAININGS.findIndex((training) => training.id === id);
  if (index === -1) throw new Error("Training not found");
  
  MOCK_TRAININGS[index] = { ...MOCK_TRAININGS[index], ...data };
  return MOCK_TRAININGS[index];
}

export function deleteTraining(id: string): void {
  const index = MOCK_TRAININGS.findIndex((training) => training.id === id);
  if (index !== -1) {
    MOCK_TRAININGS.splice(index, 1);
  }
}

export function enrollParticipant(
  trainingId: string,
  participant: Omit<TrainingParticipant, "status" | "enrollmentDate">
): TrainingParticipant {
  const training = MOCK_TRAININGS.find((t) => t.id === trainingId);
  if (!training) throw new Error("Training not found");

  if (training.participants.length >= training.maxParticipants) {
    throw new Error("Training is full");
  }

  const newParticipant: TrainingParticipant = {
    ...participant,
    status: "enrolled",
    enrollmentDate: new Date().toISOString(),
  };

  training.participants.push(newParticipant);
  return newParticipant;
}

export function updateParticipantStatus(
  trainingId: string,
  employeeId: string,
  status: TrainingParticipant["status"],
  data?: Partial<TrainingParticipant>
): TrainingParticipant {
  const training = MOCK_TRAININGS.find((t) => t.id === trainingId);
  if (!training) throw new Error("Training not found");

  const participant = training.participants.find(
    (p) => p.employeeId === employeeId
  );
  if (!participant) throw new Error("Participant not found");

  Object.assign(participant, { status, ...data });
  return participant;
}

export function getTrainingStats() {
  const stats = {
    total: MOCK_TRAININGS.length,
    upcoming: 0,
    inProgress: 0,
    completed: 0,
    totalParticipants: 0,
    completionRate: 0,
    averageScore: 0,
  };

  let totalCompletedWithScore = 0;
  let totalScores = 0;

  MOCK_TRAININGS.forEach((training) => {
    switch (training.status) {
      case 'upcoming':
        stats.upcoming += 1;
        break;
      case 'in-progress':
        stats.inProgress += 1;
        break;
      case 'completed':
        stats.completed += 1;
        break;
    }
    stats.totalParticipants += training.participants.length;

    const completedParticipants = training.participants.filter(
      (p) => p.status === "completed"
    );

    if (completedParticipants.length > 0) {
      completedParticipants.forEach((p) => {
        if (p.score !== undefined) {
          totalCompletedWithScore += 1;
          totalScores += p.score;
        }
      });
    }
  });

  stats.completionRate =
    stats.totalParticipants > 0
      ? (stats.completed / stats.totalParticipants) * 100
      : 0;

  stats.averageScore =
    totalCompletedWithScore > 0 ? totalScores / totalCompletedWithScore : 0;

  return stats;
}