import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  ArrowRight 
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  form_types: { name: string } | null;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

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

      const pending = data?.filter((a) => a.status === "pending" || a.status === "in_review").length || 0;
      const approved = data?.filter((a) => a.status === "approved").length || 0;
      const completed = data?.filter((a) => a.status === "completed").length || 0;

      setStats({
        total: data?.length || 0,
        pending,
        approved,
        completed,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pending":
      case "in_review":
        return <Clock className="h-4 w-4 text-warning" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
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

  return (
    <UserLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your tax form applications
            </p>
          </div>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link to="/dashboard/new-application">
              <Plus className="h-5 w-5 mr-2" />
              New Application
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
              <FileText className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/applications">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first tax form application
                </p>
                <Button asChild className="bg-accent hover:bg-accent/90">
                  <Link to="/dashboard/new-application">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Application
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium">{app.form_types?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()} • ${app.total_price}
                        </p>
                      </div>
                    </div>
                    <span className={getStatusBadge(app.status)}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/dashboard/new-application">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">W-2 Form</h3>
                  <p className="text-sm text-muted-foreground">
                    Wage and Tax Statement
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/dashboard/new-application">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10 text-success">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">1099-NEC</h3>
                  <p className="text-sm text-muted-foreground">
                    Nonemployee Compensation
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/dashboard/new-application">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10 text-warning">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">1099-MISC</h3>
                  <p className="text-sm text-muted-foreground">
                    Miscellaneous Income
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
