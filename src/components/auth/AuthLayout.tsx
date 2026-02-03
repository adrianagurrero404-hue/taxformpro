import { ReactNode } from "react";
import { FileText, Shield, Clock, CheckCircle } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-display font-bold">TaxForm Pro</span>
            </div>
            <p className="text-primary-foreground/70 text-lg">
              Professional Tax Document Generator
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-display font-bold leading-tight">
              Generate professional<br />
              W-2 & 1099 forms<br />
              <span className="text-accent">in minutes</span>
            </h2>

            <div className="grid gap-4">
              <FeatureItem 
                icon={<Shield className="h-5 w-5" />}
                title="Bank-Level Security"
                description="Your data is encrypted and secure"
              />
              <FeatureItem 
                icon={<Clock className="h-5 w-5" />}
                title="Fast Processing"
                description="Get your forms within 24 hours"
              />
              <FeatureItem 
                icon={<CheckCircle className="h-5 w-5" />}
                title="IRS Compliant"
                description="Forms meet all federal requirements"
              />
            </div>
          </div>

          <p className="text-primary-foreground/50 text-sm">
            © 2025 TaxForm Pro. All rights reserved.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 -right-10 w-60 h-60 rounded-full bg-accent/5 blur-2xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">TaxForm Pro</span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-accent/20 text-accent">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-primary-foreground">{title}</h3>
        <p className="text-primary-foreground/60 text-sm">{description}</p>
      </div>
    </div>
  );
}
