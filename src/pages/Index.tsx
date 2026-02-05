import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Shield, Clock, CheckCircle, Users } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">TaxForm Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 px-4"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6 animate-fade-in">
              Fast W-2 Tax Refunds 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 animate-slide-up">
              Get Your<br />
              <span className="text-accent">W-2 Tax Refund</span><br />
              Faster
            </h1>
            <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto animate-slide-up">
              Submit your W-2 and get your tax refund processed quickly. 
              Professional service with maximum returns guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                <Link to="/tax-refund">
                  Get Your Refund Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6">
                <Link to="/signup">
                  Create Forms
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose TaxForm Pro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make tax document generation simple, secure, and stress-free.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Bank-Level Security"
              description="Your sensitive data is encrypted with 256-bit SSL. We never store SSNs."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Fast Processing"
              description="Get your completed forms within 24 hours. Rush orders available."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="IRS Compliant"
              description="All forms meet federal requirements and are ready for filing."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Expert Support"
              description="Our tax specialists are here to help you every step of the way."
            />
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Available Tax Forms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We support all major W-2 and 1099 form types.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "W-2", desc: "Wage and Tax Statement" },
              { name: "1099-NEC", desc: "Nonemployee Compensation" },
              { name: "1099-MISC", desc: "Miscellaneous Income" },
              { name: "1099-G", desc: "Government Payments" },
              { name: "1099-R", desc: "Pension Distributions" },
              { name: "1099-INT", desc: "Interest Income" },
            ].map((form) => (
              <div
                key={form.name}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{form.name}</h3>
                <p className="text-muted-foreground">{form.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/signup">
                View All Forms
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/paystub">
                Create Paystub
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/tax-refund">
                Get Tax Refund
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
            Ready to Get Your Refund?
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            Submit your W-2 today and let our tax experts maximize your return. Fast, secure processing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
              <Link to="/tax-refund">
                Start My Refund
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6">
              <Link to="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-lg">TaxForm Pro</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              © 2026 TaxForm Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
      <div className="p-3 rounded-lg bg-accent/10 text-accent w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
