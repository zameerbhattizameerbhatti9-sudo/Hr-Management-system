import { Performance, PerformanceGoal } from "@/types";

const MOCK_PERFORMANCES: Performance[] = [
  {
    id: "1",
    employeeId: "1",
    reviewerId: "15",
    date: "2023-09-30",
    type: "quarterly",
    ratings: {
      technical: 4.5,
      communication: 4.0,
      teamwork: 4.2,
      leadership: 3.8,
      overall: 4.1
    },
    goals: [],
    comments: "John has shown excellent technical skills and good teamwork. Could improve on leadership initiatives.",
    nextReviewDate: "2023-12-31"
  },
  {
    id: "2",
    employeeId: "2",
    reviewerId: "6",
    date: "2023-09-30",
    type: "quarterly",
    ratings: {
      technical: 4.0,
      communication: 4.8,
      teamwork: 4.5,
      leadership: 4.3,
      overall: 4.4
    },
    goals: [],
    comments: "Sarah excels in communication and project management. Strong leadership potential.",
    nextReviewDate: "2023-12-31"
  }
];
const MOCK_GOALS: PerformanceGoal[] = [
  {
    id: "1",
    employeeId: "1",
    title: "AWS Solutions Architect Certification",
    description: "Complete AWS certification to enhance cloud architecture skills",
    startDate: "2023-10-01",
    dueDate: "2024-03-31",
    status: "in-progress",
    progress: 45,
    category: "technical"
  },
  {
    id: "2",
    employeeId: "1",
    title: "Team Leadership Workshop",
    description: "Complete leadership training and lead a team project",
    startDate: "2023-10-01",
    dueDate: "2023-12-31",
    status: "not-started",
    progress: 0,
    category: "soft-skills"
  },
  {
    id: "3",
    employeeId: "2",
    title: "Product Strategy Certification",
    description: "Complete advanced product management certification",
    startDate: "2023-09-01",
    dueDate: "2024-02-28",
    status: "in-progress",
    progress: 70,
    category: "professional"
  }
];

export function getEmployeePerformance(employeeId: string): Performance[] {
  return MOCK_PERFORMANCES.filter((perf) => perf.employeeId === employeeId);
}

export function getLatestPerformance(employeeId: string): Performance | undefined {
  return MOCK_PERFORMANCES
    .filter((perf) => perf.employeeId === employeeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

export function addPerformanceReview(review: Omit<Performance, "id">): Performance {
  const newReview = {
    ...review,
    id: Math.random().toString(36).substr(2, 9),
  };
  MOCK_PERFORMANCES.push(newReview);
  return newReview;
}

export function updatePerformanceReview(id: string, data: Partial<Performance>): Performance {
  const index = MOCK_PERFORMANCES.findIndex((perf) => perf.id === id);
  if (index === -1) throw new Error("Performance review not found");
  
  MOCK_PERFORMANCES[index] = { ...MOCK_PERFORMANCES[index], ...data };
  return MOCK_PERFORMANCES[index];
}

export function getEmployeeGoals(employeeId: string): PerformanceGoal[] {
  return MOCK_GOALS.filter((goal) => goal.employeeId === employeeId);
}

export function addGoal(goal: Omit<PerformanceGoal, "id">): PerformanceGoal {
  const newGoal = {
    ...goal,
    id: Math.random().toString(36).substr(2, 9),
  };
  MOCK_GOALS.push(newGoal);
  return newGoal;
}

export function updateGoal(id: string, data: Partial<PerformanceGoal>): PerformanceGoal {
  const index = MOCK_GOALS.findIndex((goal) => goal.id === id);
  if (index === -1) throw new Error("Goal not found");
  
  MOCK_GOALS[index] = { ...MOCK_GOALS[index], ...data };
  return MOCK_GOALS[index];
}

export function deleteGoal(id: string): void {
  const index = MOCK_GOALS.findIndex((goal) => goal.id === id);
  if (index !== -1) {
    MOCK_GOALS.splice(index, 1);
  }
}

export function getPerformanceStats(employeeId: string) {
  const performances = getEmployeePerformance(employeeId);
  const goals = getEmployeeGoals(employeeId);

  const averageRatings = performances.reduce(
    (acc, curr) => {
      acc.technical += curr.ratings.technical;
      acc.communication += curr.ratings.communication;
      acc.teamwork += curr.ratings.teamwork;
      acc.leadership += curr.ratings.leadership;
      acc.overall += curr.ratings.overall;
      return acc;
    },
    { technical: 0, communication: 0, teamwork: 0, leadership: 0, overall: 0 }
  );

  const count = performances.length;
  if (count > 0) {
    averageRatings.technical /= count;
    averageRatings.communication /= count;
    averageRatings.teamwork /= count;
    averageRatings.leadership /= count;
    averageRatings.overall /= count;
  }

  const goalStats = {
    total: goals.length,
    completed: goals.filter((g) => g.status === "completed").length,
    inProgress: goals.filter((g) => g.status === "in-progress").length,
    notStarted: goals.filter((g) => g.status === "not-started").length,
    overdue: goals.filter((g) => g.status === "overdue").length,
  };

  return {
    averageRatings,
    goalStats,
    reviewCount: count,
    lastReviewDate: count > 0 ? performances[0].date : null,
  };
}