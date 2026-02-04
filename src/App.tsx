import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Paystub from "./pages/Paystub";
import TaxRefund from "./pages/TaxRefund";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFormTypes from "./pages/admin/AdminFormTypes";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminSettings from "./pages/admin/AdminSettings";

// User pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import UserApplications from "./pages/dashboard/UserApplications";
import NewApplication from "./pages/dashboard/NewApplication";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/paystub" element={<Paystub />} />
            <Route path="/tax-refund" element={<TaxRefund />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/form-types" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFormTypes />
              </ProtectedRoute>
            } />
            <Route path="/admin/applications" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminApplications />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            } />

            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/applications" element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserApplications />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/new-application" element={
              <ProtectedRoute allowedRoles={["user"]}>
                <NewApplication />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;