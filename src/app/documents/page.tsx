"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

    const document: Omit<EmployeeDocument, "id"> = {
      employeeId: selectedEmployee || user?.id!,
      type: formData.get("type") as any,
      title: formData.get("title") as string,
      url: fakeUrl,
      uploadDate: new Date().toISOString(),
      expiryDate: (formData.get("expiryDate") as string) || undefined,
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
        {documents.map((doc) => (
          <Card key={doc.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-slate-400" />
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {doc.type}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteDocument(doc.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div>
                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
              </div>
              {doc.expiryDate && (
                <div>
                  Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <Button
              className="w-full mt-4"
              variant="secondary"
              onClick={() => window.open(doc.url, "_blank")}
            >
              View Document
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDocument} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Type</Label>
              <select name="type" className="w-full p-2 border rounded-md">
                <option value="contract">Contract</option>
                <option value="certificate">Certificate</option>
                <option value="id">ID Document</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label>Document</Label>
              <Input name="file" type="file" required />
            </div>
            <div>
              <Label>Expiry Date (Optional)</Label>
              <Input name="expiryDate" type="date" />
            </div>
            <Button type="submit" className="w-full">
              Upload Document
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}