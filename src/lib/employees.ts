import { Employee } from "@/types";

// In a real app, this would be fetched from an API
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "16",
    name: "Amanda Foster",
    email: "amanda.f@example.com",
    role: "employee",
    position: "HR Specialist",
    department: "Human Resources",
    joinDate: "2023-07-01",
    salary: 68000,
    managerId: "6",
    skills: ["Employee Relations", "Recruitment", "Benefits Administration", "Onboarding"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    }
  },
  {
    id: "17",
    name: "Ryan Chang",
    email: "ryan.c@example.com",
    role: "employee",
    position: "Cloud Architect",
    department: "Engineering",
    joinDate: "2023-04-15",
    salary: 115000,
    managerId: "15",
    skills: ["AWS", "Azure", "Google Cloud", "Terraform", "Microservices"],
    documents: [],
    leaveBalance: {
      annual: 20,
      sick: 10,
      personal: 5,
      carryOver: 2
    }
  },
  {
    id: "18",
    name: "Priya Patel",
    email: "priya.p@example.com",
    role: "employee",
    position: "Data Scientist",
    department: "Analytics",
    joinDate: "2023-08-01",
    salary: 95000,
    managerId: "6",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    }
  },
  {
    id: "19",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    role: "employee",
    position: "Financial Analyst",
    department: "Finance",
    joinDate: "2023-06-15",
    salary: 75000,
    managerId: "6",
    skills: ["Financial Modeling", "Excel", "PowerBI", "Risk Analysis"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    }
  },
  {
    id: "20",
    name: "Isabella Santos",
    email: "isabella.s@example.com",
    role: "employee",
    position: "Customer Success Manager",
    department: "Customer Support",
    joinDate: "2023-05-01",
    salary: 72000,
    managerId: "6",
    skills: ["Customer Relations", "Project Management", "Sales", "Communication"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 1
    }
  },
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "employee",
    position: "Senior Software Engineer",
    department: "Engineering",
    joinDate: "2023-01-15",
    salary: 95000,
    managerId: "15",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
    documents: [],
    leaveBalance: {
      annual: 20,
      sick: 10,
      personal: 5,
      carryOver: 2
    }
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "employee",
    position: "Product Manager",
    department: "Product",
    joinDate: "2022-11-01",
    salary: 88000,
    managerId: "6",
    skills: ["Product Management", "Agile", "Scrum", "Strategic Planning"],
    documents: [],
    leaveBalance: {
      annual: 18,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
  },
  {
    id: "3",
    name: "Michael Williams",
    email: "michael@example.com",
    role: "employee",
    position: "UX Designer",
    department: "Design",
    joinDate: "2023-03-20",
    salary: 72000,
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "employee",
    position: "Frontend Developer",
    department: "Engineering",
    joinDate: "2023-06-15",
    salary: 78000,
    skills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "15",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    role: "employee",
    position: "DevOps Engineer",
    department: "Engineering",
    joinDate: "2023-02-10",
    salary: 92000,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins"],
    documents: [],
    leaveBalance: {
      annual: 18,
      sick: 10,
      personal: 5,
      carryOver: 1
    },
    managerId: "15",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa@example.com",
    role: "employee",
    position: "HR Manager",
    department: "Human Resources",
    joinDate: "2022-09-01",
    salary: 82000,
    skills: ["HR Management", "Recruitment", "Employee Relations", "Training"],
    documents: [],
    leaveBalance: {
      annual: 20,
      sick: 10,
      personal: 5,
      carryOver: 3
    },
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james@example.com",
    role: "employee",
    position: "Backend Developer",
    department: "Engineering",
    joinDate: "2023-04-05",
    salary: 85000,
    skills: ["Node.js", "Python", "MongoDB", "Express", "SQL"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "15",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "employee",
    position: "Marketing Specialist",
    department: "Marketing",
    joinDate: "2023-01-20",
    salary: 65000,
    skills: ["Digital Marketing", "Social Media", "Content Strategy", "Analytics"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "robert@example.com",
    role: "employee",
    position: "Systems Analyst",
    department: "IT",
    joinDate: "2022-12-15",
    salary: 76000,
    skills: ["System Analysis", "Project Management", "Business Analysis", "SQL"],
    documents: [],
    leaveBalance: {
      annual: 18,
      sick: 10,
      personal: 5,
      carryOver: 2
    },
    managerId: "6",
  },
  {
    id: "10",
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    role: "employee",
    position: "Content Writer",
    department: "Marketing",
    joinDate: "2023-05-01",
    salary: 62000,
    skills: ["Content Writing", "SEO", "Copywriting", "Social Media"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "11",
    name: "Alex Martinez",
    email: "alex@example.com",
    role: "employee",
    position: "Quality Assurance",
    department: "Engineering",
    joinDate: "2023-03-15",
    salary: 71000,
    skills: ["Test Automation", "Selenium", "API Testing", "Test Planning"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "15",
  },
  {
    id: "12",
    name: "Rachel Brown",
    email: "rachel@example.com",
    role: "employee",
    position: "UI Designer",
    department: "Design",
    joinDate: "2023-02-01",
    salary: 69000,
    skills: ["UI Design", "Adobe XD", "Sketch", "Wireframing"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "13",
    name: "Daniel Park",
    email: "daniel@example.com",
    role: "employee",
    position: "Data Analyst",
    department: "Analytics",
    joinDate: "2023-04-20",
    salary: 74000,
    skills: ["Data Analysis", "Python", "SQL", "Tableau", "R"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "14",
    name: "Sophie Anderson",
    email: "sophie@example.com",
    role: "employee",
    position: "Project Coordinator",
    department: "Product",
    joinDate: "2023-06-01",
    salary: 63000,
    skills: ["Project Management", "Agile", "Communication", "Documentation"],
    documents: [],
    leaveBalance: {
      annual: 15,
      sick: 10,
      personal: 5,
      carryOver: 0
    },
    managerId: "6",
  },
  {
    id: "15",
    name: "Thomas Wright",
    email: "thomas@example.com",
    role: "employee",
    position: "Full Stack Developer",
    department: "Engineering",
    joinDate: "2023-01-10",
    salary: 88000,
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    documents: [],
    leaveBalance: {
      annual: 18,
      sick: 10,
      personal: 5,
      carryOver: 2
    },
  }
];

export function getEmployees(): Employee[] {
  // In a real app, this would fetch from an API
  return MOCK_EMPLOYEES;
}

export function addEmployee(employee: Omit<Employee, "id">): Employee {
  // Generate a unique ID using timestamp and random string
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const id = `${timestamp}-${random}`;

  const newEmployee = {
    ...employee,
    id,
  };
  MOCK_EMPLOYEES.push(newEmployee);
  return newEmployee;
}

export function updateEmployee(id: string, data: Partial<Employee>): Employee {
  const index = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Employee not found");
  
  MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...data };
  return MOCK_EMPLOYEES[index];
}

export function deleteEmployee(id: string): void {
  const index = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
  if (index !== -1) {
    MOCK_EMPLOYEES.splice(index, 1);
  }
}

export function getEmployeesByDepartment(department: string): Employee[] {
  return MOCK_EMPLOYEES.filter(emp => emp.department === department);
}

export function getEmployeesByManager(managerId: string): Employee[] {
  return MOCK_EMPLOYEES.filter(emp => emp.managerId === managerId);
}

export function getManagerList(): Employee[] {
  return MOCK_EMPLOYEES.filter(emp => emp.role === "manager");
}

export function searchEmployees(query: string): Employee[] {
  const searchTerm = query.toLowerCase();
  return MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm) ||
    emp.position?.toLowerCase().includes(searchTerm) ||
    emp.department.toLowerCase().includes(searchTerm) ||
    emp.skills.some(skill => skill.toLowerCase().includes(searchTerm))
  );
}

export function getDepartmentStatistics(department: string) {
  const employees = getEmployeesByDepartment(department);
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0;
  
  const skillMap = new Map<string, number>();
  employees.forEach(emp => {
    emp.skills.forEach(skill => {
      skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
    });
  });

  const topSkills = Array.from(skillMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({ skill, count }));

  return {
    totalEmployees: employees.length,
    totalSalary,
    averageSalary: avgSalary,
    managers: employees.filter(emp => emp.role === "manager").length,
    topSkills,
  };
}