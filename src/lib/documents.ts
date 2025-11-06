import { EmployeeDocument } from "@/types";

const MOCK_DOCUMENTS: EmployeeDocument[] = [
  {
    id: "5",
    employeeId: "1",
    type: "policy",
    title: "Employee Handbook 2025",
    url: "/documents/handbook-2025.pdf",
    uploadDate: "2025-01-01",
    status: "active",
    category: "HR Policies",
    tags: ["handbook", "policy", "guidelines"],
    description: "Official employee handbook for the year 2025",
    version: "2.0",
    accessLevel: "all"
  },
  {
    id: "6",
    employeeId: "6", // HR Manager
    type: "policy",
    title: "Leave Policy",
    url: "/documents/leave-policy-2025.pdf",
    uploadDate: "2025-01-01",
    status: "active",
    category: "HR Policies",
    tags: ["leave", "policy", "attendance"],
    description: "Updated leave policy and guidelines",
    version: "1.2",
    accessLevel: "all"
  },
  {
    id: "7",
    employeeId: "6",
    type: "form",
    title: "Performance Review Template",
    url: "/documents/performance-review-template.pdf",
    uploadDate: "2025-01-15",
    status: "active",
    category: "Forms",
    tags: ["performance", "review", "template"],
    description: "Standard performance review form",
    version: "1.0",
    accessLevel: "manager"
  },
  {
    id: "1",
    employeeId: "1",
    type: "contract",
    title: "Employment Contract",
    url: "/documents/contract-john-doe.pdf",
    uploadDate: "2023-01-15",
  },
  {
    id: "2",
    employeeId: "1",
    type: "certificate",
    title: "AWS Certification",
    url: "/documents/aws-cert-john-doe.pdf",
    uploadDate: "2023-03-20",
    expiryDate: "2026-03-20",
  },
  {
    id: "3",
    employeeId: "2",
    type: "contract",
    title: "Employment Contract",
    url: "/documents/contract-sarah-chen.pdf",
    uploadDate: "2022-11-01",
  },
  {
    id: "4",
    employeeId: "2",
    type: "certificate",
    title: "Project Management Professional (PMP)",
    url: "/documents/pmp-cert-sarah.pdf",
    uploadDate: "2023-01-15",
    expiryDate: "2026-01-15",
  }
];

export function getEmployeeDocuments(employeeId: string): EmployeeDocument[] {
  return MOCK_DOCUMENTS.filter((doc) => doc.employeeId === employeeId);
}

export function addDocument(document: Omit<EmployeeDocument, "id">): EmployeeDocument {
  const newDocument = {
    ...document,
    id: Math.random().toString(36).substr(2, 9),
  };
  MOCK_DOCUMENTS.push(newDocument);
  return newDocument;
}

export function updateDocument(id: string, data: Partial<EmployeeDocument>): EmployeeDocument {
  const index = MOCK_DOCUMENTS.findIndex((doc) => doc.id === id);
  if (index === -1) throw new Error("Document not found");
  
  MOCK_DOCUMENTS[index] = { ...MOCK_DOCUMENTS[index], ...data };
  return MOCK_DOCUMENTS[index];
}

export function deleteDocument(id: string): void {
  const index = MOCK_DOCUMENTS.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    MOCK_DOCUMENTS.splice(index, 1);
  }
}

export function getExpiringDocuments(daysThreshold: number = 30): EmployeeDocument[] {
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);

  return MOCK_DOCUMENTS.filter((doc) => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    return expiryDate <= thresholdDate;
  });
}