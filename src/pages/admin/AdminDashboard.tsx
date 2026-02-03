import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileStack, 
  DollarSign, 
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalRevenue: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch applications
        const { data: applications } = await supabase
          .from("form_applications")
          .select("*, form_types(name), profiles(email, full_name)")
          .order("created_at", { ascending: false });

        if (applications) {
          const pending = applications.filter((a) => a.status === "pending").length;
          const completed = applications.filter((a) => a.status === "completed").length;
          const revenue = applications
            .filter((a) => a.status === "completed")
            .reduce((sum, a) => sum + Number(a.total_price), 0);

          setStats({
            totalUsers: usersCount || 0,
            totalApplications: applications.length,
            pendingApplications: pending,
            completedApplications: completed,
            totalRevenue: revenue,
          });

          setRecentApplications(applications.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

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
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your tax form business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applications
              </CardTitle>
              <FileStack className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-warning">{stats.pendingApplications}</span> pending review
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {stats.completedApplications} completed
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-stat">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalApplications > 0
                  ? Math.round((stats.completedApplications / stats.totalApplications) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Of all applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Applications */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionCard
                icon={<Clock className="h-5 w-5" />}
                title="Review Pending"
                description={`${stats.pendingApplications} applications waiting`}
                href="/admin/applications?status=pending"
                variant="warning"
              />
              <QuickActionCard
                icon={<CheckCircle className="h-5 w-5" />}
                title="Manage Form Types"
                description="Configure forms and pricing"
                href="/admin/form-types"
                variant="success"
              />
              <QuickActionCard
                icon={<Users className="h-5 w-5" />}
                title="User Management"
                description="View and manage users"
                href="/admin/users"
                variant="accent"
              />
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : recentApplications.length === 0 ? (
                <p className="text-muted-foreground">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {app.profiles?.full_name || app.profiles?.email || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {app.form_types?.name} • ${app.total_price}
                        </p>
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
        </div>
      </div>
    </AdminLayout>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant: "warning" | "success" | "accent";
}) {
  const variantStyles = {
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 hover:shadow-md transition-all"
    >
      <div className={`p-3 rounded-lg ${variantStyles[variant]}`}>
        {icon}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
