import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Eye,
  Trash2,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  form_types: { name: string } | null;
}

export default function UserApplications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  async function fetchApplications() {
    try {
      const { data, error } = await supabase
        .from("form_applications")
        .select("id, status, total_price, created_at, form_types(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteApplication() {
    if (!applicationToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("form_applications")
        .delete()
        .eq("id", applicationToDelete.id);

      if (error) throw error;

      toast({ title: "Application deleted" });
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete application. You can only delete pending applications.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete(app: Application) {
    setApplicationToDelete(app);
    setDeleteDialogOpen(true);
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pending":
      case "in_review":
      case "in_progress":
        return <Clock className="h-5 w-5 text-warning" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: "status-badge status-pending",
      in_review: "status-badge status-in-review",
      in_progress: "status-badge status-in-review",
      approved: "status-badge status-approved",
      rejected: "status-badge status-rejected",
      completed: "status-badge status-completed",
    };
    return styles[status] || "status-badge";
  }

  const filteredApplications = applications.filter(
    (app) => statusFilter === "all" || app.status === statusFilter
  );

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your form applications
            </p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link to="/dashboard/new-application">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Link>
          </Button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {filteredApplications.length} application(s)
          </p>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter === "all"
                  ? "Start by creating your first tax form application"
                  : `No ${statusFilter} applications`}
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link to="/dashboard/new-application">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Application
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {app.form_types?.name}
                        </h3>
                        <p className="text-muted-foreground">
                          Submitted on {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">${app.total_price}</p>
                        <span className={getStatusBadge(app.status)}>
                          {app.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-5 w-5" />
                        </Button>
                        {app.status === "pending" && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDelete(app)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this application? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteApplication}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </UserLayout>
  );
}