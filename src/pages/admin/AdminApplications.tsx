import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, CheckCircle, XCircle, Clock, Download, FileImage, Trash2, Square, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Application {
  id: string;
  user_id: string;
  form_type_id: string;
  status: string;
  form_data: any;
  uploaded_files: any;
  total_price: number;
  admin_notes: string | null;
  created_at: string;
  form_types: { name: string } | null;
  profiles: { email: string; full_name: string | null } | null;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const { data: apps, error } = await supabase
        .from("form_applications")
        .select("*, form_types(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch profile data separately for each application
      const appsWithProfiles = await Promise.all(
        (apps || []).map(async (app) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", app.user_id)
            .single();
          
          return {
            ...app,
            profiles: profile || { email: "", full_name: null },
          };
        })
      );
      
      setApplications(appsWithProfiles);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("form_applications")
        .update({ status: newStatus, admin_notes: adminNotes })
        .eq("id", appId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Application marked as ${newStatus}`,
      });

      fetchApplications();
      setDetailsOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  }

  async function downloadFile(file: any) {
    // Validate file object
    if (!file || typeof file !== 'object') {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Invalid file data",
      });
      return;
    }

    const fileName = file.name || file.fileName || "download";
    
    // Try to get storage path from various possible properties
    let storagePath = file.path || file.storagePath;
    
    // If no direct path, try to extract from URL
    if (!storagePath && file.url) {
      try {
        const url = new URL(file.url);
        // Extract path after /object/public/application-files/
        const match = url.pathname.match(/\/object\/public\/application-files\/(.+)/);
        if (match) {
          storagePath = decodeURIComponent(match[1]);
        }
      } catch (e) {
        console.error("Failed to parse file URL:", e);
      }
    }

    if (!storagePath) {
      // Last resort: try direct fetch from public URL
      if (file.url) {
        try {
          const response = await fetch(file.url);
          if (!response.ok) throw new Error("Fetch failed");
          
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Download started",
            description: fileName,
          });
          return;
        } catch (e) {
          console.error("Direct fetch failed:", e);
        }
      }
      
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "File path not found. The file may have been uploaded before path tracking was enabled.",
      });
      return;
    }

    try {
      // Use direct download which fetches as blob - ensures actual download
      const { data, error } = await supabase.storage
        .from("application-files")
        .download(storagePath);

      if (error) throw error;

      // Create blob URL and trigger download
      const blob = new Blob([data], { type: data.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: fileName,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download the file. Please try again.",
      });
    }
  }

  async function deleteApplication(appId: string, showConfirm = true) {
    if (showConfirm && !confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("form_applications")
        .delete()
        .eq("id", appId);

      if (error) throw error;

      toast({
        title: "Application deleted",
        description: "The application has been permanently removed.",
      });

      setDetailsOpen(false);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete application",
      });
    }
  }

  async function bulkDeleteApplications() {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} application(s)? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const { error } = await supabase
        .from("form_applications")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;

      toast({
        title: "Applications deleted",
        description: `${selectedIds.size} application(s) have been permanently removed.`,
      });

      setSelectedIds(new Set());
      fetchApplications();
    } catch (error) {
      console.error("Error bulk deleting applications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete applications",
      });
    } finally {
      setBulkDeleting(false);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map((app) => app.id)));
    }
  }

  function toggleSelectOne(appId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  }

  function openDetails(app: Application) {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || "");
    setDetailsOpen(true);
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: "status-badge status-pending",
      in_review: "status-badge status-in-review",
      approved: "status-badge status-approved",
      rejected: "status-badge status-rejected",
      completed: "status-badge status-completed",
    };
    return styles[status] || "status-badge";
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.form_types?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage user form applications
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={bulkDeleteApplications}
              disabled={bulkDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedIds.size} Selected
            </Button>
          )}
        </div>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredApplications.length > 0 && selectedIds.size === filteredApplications.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Form Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading applications...
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id} className={selectedIds.has(app.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(app.id)}
                          onCheckedChange={() => toggleSelectOne(app.id)}
                          aria-label={`Select application ${app.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {app.profiles?.full_name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {app.profiles?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{app.form_types?.name}</TableCell>
                      <TableCell>${app.total_price}</TableCell>
                      <TableCell>
                        <span className={getStatusBadge(app.status)}>
                          {app.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(app)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteApplication(app.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Application Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application details, download files, and update status.
              </DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-6 py-4">
                {/* User Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Applicant</h3>
                  <p>{selectedApp.profiles?.full_name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedApp.profiles?.email}
                  </p>
                </div>

                {/* Form Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Form Type</p>
                    <p className="font-semibold">{selectedApp.form_types?.name}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold text-lg">${selectedApp.total_price}</p>
                  </div>
                </div>

                {/* Form Data */}
                <div>
                  <h3 className="font-semibold mb-3">Submitted Data</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedApp.form_data || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uploaded Files */}
                {selectedApp.uploaded_files && Array.isArray(selectedApp.uploaded_files) && selectedApp.uploaded_files.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Uploaded Files</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(selectedApp.uploaded_files as any[]).map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileImage className="h-5 w-5 text-accent shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{file.name || `File ${index + 1}`}</p>
                              <p className="text-sm text-muted-foreground">{file.fieldLabel || file.fieldName}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => updateStatus(selectedApp.id, "in_review")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Mark In Review
                  </Button>
                  <Button
                    onClick={() => updateStatus(selectedApp.id, "approved")}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => updateStatus(selectedApp.id, "rejected")}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => updateStatus(selectedApp.id, "completed")}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                </div>

                {/* Delete Application */}
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => deleteApplication(selectedApp.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
