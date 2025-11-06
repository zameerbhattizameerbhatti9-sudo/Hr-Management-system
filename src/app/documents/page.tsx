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
  getEmployeeDocuments,
  addDocument,
  deleteDocument,
  getExpiringDocuments,
} from "@/lib/documents";
import { EmployeeDocument } from "@/types";
import { FileText, Trash2, AlertTriangle } from "lucide-react";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [expiringDocs, setExpiringDocs] = useState<EmployeeDocument[]>([]);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(user?.id || "");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (user) {
      const empId = isAdmin ? selectedEmployee || user.id : user.id;
      setDocuments(getEmployeeDocuments(empId));
      if (isAdmin) {
        setExpiringDocs(getExpiringDocuments(30));
      }
    }
  }, [isAdmin, selectedEmployee, user]);

  const handleAddDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Handle file upload (in a real app, this would upload to a server)
    const file = formData.get("file") as File;
    const fakeUrl = URL.createObjectURL(file); // In real app, this would be the server URL

    const tags = (formData.get("tags") as string)
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    const document: Omit<EmployeeDocument, "id"> = {
      employeeId: selectedEmployee || user?.id!,
      type: formData.get("type") as any,
      title: formData.get("title") as string,
      url: fakeUrl,
      uploadDate: new Date().toISOString(),
      expiryDate: (formData.get("expiryDate") as string) || undefined,
      category: formData.get("category") as string,
      status: formData.get("status") as "active" | "draft" | "archived",
      accessLevel: formData.get("accessLevel") as "all" | "manager" | "hr" | "personal",
      description: formData.get("description") as string,
      version: formData.get("version") as string,
      tags: tags
    };

    const newDoc = addDocument(document);
    setDocuments([...documents, newDoc]);
    setIsAddDocOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
          <p className="text-muted-foreground">
            Upload and manage employee documents
          </p>
        </div>
        <Button onClick={() => setIsAddDocOpen(true)}>Upload Document</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] bg-background text-foreground">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="contract">Contracts</SelectItem>
            <SelectItem value="certificate">Certificates</SelectItem>
            <SelectItem value="id">ID Documents</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {isAdmin && (
          <Button variant="outline">
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Expiring
          </Button>
        )}
      </div>

      {isAdmin && expiringDocs.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-medium">Documents Expiring Soon</h3>
          </div>
          <div className="space-y-3">
            {expiringDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-medium">{doc.title}</span>
                  <span className="text-muted-foreground ml-2">
                    (Expires: {new Date(doc.expiryDate!).toLocaleDateString()})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.url, "_blank")}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="p-6 relative group">
            {doc.expiryDate && new Date(doc.expiryDate) < new Date() && (
              <div className="absolute top-2 right-2">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Expired
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded">
                  <FileText className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium leading-none mb-1">{doc.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full capitalize">
                      {doc.type}
                    </span>
                    {doc.category && (
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                        {doc.category}
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Uploaded:</span>
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>
              {doc.expiryDate && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Expires:</span>
                  <span>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              {doc.version && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Version:</span>
                  <span>{doc.version}</span>
                </div>
              )}
            </div>

            {doc.tags && doc.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {doc.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => window.open(doc.url, "_blank")}
              >
                View Document
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = doc.url;
                  link.download = doc.title;
                  link.click();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDocument} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div>
                <Label>Type</Label>
                <Select name="type" defaultValue="contract">
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="id">ID Document</SelectItem>
                    <SelectItem value="policy">Policy Document</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select name="category" defaultValue="hr">
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Access Level</Label>
                <Select name="accessLevel" defaultValue="all">
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="manager">Managers Only</SelectItem>
                    <SelectItem value="hr">HR Only</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <Input name="tags" placeholder="e.g., important, confidential, draft" />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                className="w-full p-2 border rounded-md min-h-[80px]"
                placeholder="Enter document description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Document</Label>
                <Input name="file" type="file" required accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx" />
              </div>
              <div>
                <Label>Version</Label>
                <Input name="version" placeholder="e.g., 1.0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiry Date (Optional)</Label>
                <Input name="expiryDate" type="date" />
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="active">
                  <SelectTrigger className="w-full bg-background text-foreground">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDocOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload Document</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}