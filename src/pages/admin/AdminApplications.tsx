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
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

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
        <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading applications...
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(app)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
