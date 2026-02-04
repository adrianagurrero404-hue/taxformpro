import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Phone,
  Mail,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Maximum Refund",
    description: "Our experts ensure you get every dollar you're entitled to."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "100% Secure",
    description: "Bank-level encryption protects your personal information."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Fast Processing",
    description: "Get your refund in as little as 7-14 business days."
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "IRS Compliant",
    description: "All filings meet federal and state requirements."
  }
];

const steps = [
  {
    step: 1,
    title: "Submit Your Request",
    description: "Fill out the form with your basic information and tax documents."
  },
  {
    step: 2,
    title: "Connect with Us",
    description: "Our team will reach out via WhatsApp to discuss your case."
  },
  {
    step: 3,
    title: "Document Review",
    description: "We review your documents and calculate your maximum refund."
  },
  {
    step: 4,
    title: "Get Your Refund",
    description: "Receive your refund directly to your bank account."
  }
];

const WHATSAPP_NUMBER = "+1234567890"; // Replace with actual number

export default function TaxRefund() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    taxYear: "2025",
    estimatedIncome: "",
    filingStatus: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hi! I'm interested in a tax refund consultation.\n\n` +
      `Name: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Tax Year: ${formData.taxYear}\n` +
      `Filing Status: ${formData.filingStatus}\n` +
      `Message: ${formData.message}`
    );

    setSubmitted(true);
    toast({
      title: "Request submitted!",
      description: "You'll be redirected to WhatsApp to continue."
    });

    // Open WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    }, 1500);
  }

  function openWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
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
            <Button onClick={openWhatsApp} className="bg-success hover:bg-success/90">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section 
        className="py-20 px-4"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              IRS Certified Partner
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Get Your Maximum<br />
              <span className="text-accent">Tax Refund</span>
            </h1>
            <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Let our tax professionals help you claim every deduction and credit 
              you deserve. Fast, secure, and hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => document.getElementById("refund-form")?.scrollIntoView({ behavior: "smooth" })}
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-lg px-8"
              >
                Start My Refund
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={openWhatsApp}
                size="lg" 
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center p-6">
                <div className="p-4 rounded-full bg-accent/10 text-accent w-fit mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our simple 4-step process makes getting your tax refund easy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <div className="p-6 rounded-xl bg-card border border-border h-full">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {step.step < 4 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 h-8 w-8 text-accent/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Form */}
      <section id="refund-form" className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">
                Request Your Tax Refund
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form and our team will contact you via WhatsApp to 
                discuss your tax situation and help you get the maximum refund.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <MessageCircle className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-medium">WhatsApp Support</p>
                    <p className="text-sm text-muted-foreground">Chat directly with our tax experts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Mail className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@taxformpro.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Phone className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">1-800-TAX-FORM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg border border-accent/30 bg-accent/5">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  Our Fee Structure
                </h4>
                <p className="text-sm text-muted-foreground">
                  We only charge a small percentage of your refund — you don't pay 
                  anything upfront. Our fee is deducted automatically when you receive 
                  your refund from the IRS. No refund, no fee!
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Redirecting you to WhatsApp to continue the conversation...
                    </p>
                    <Button onClick={openWhatsApp} className="bg-success hover:bg-success/90">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open WhatsApp
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tax Year</Label>
                        <Input
                          value={formData.taxYear}
                          onChange={(e) => updateField("taxYear", e.target.value)}
                          placeholder="2025"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Filing Status</Label>
                        <Input
                          value={formData.filingStatus}
                          onChange={(e) => updateField("filingStatus", e.target.value)}
                          placeholder="Single, Married, etc."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Information</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Any additional details about your tax situation..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                      Submit & Connect on WhatsApp
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <Link to="/terms" className="underline">Terms of Service</Link> and{" "}
                      <Link to="/privacy" className="underline">Privacy Policy</Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> TaxForm Pro is a tax preparation service. We are not 
            attorneys, CPAs, or enrolled agents unless otherwise specified. Tax advice and 
            preparation services are provided in accordance with applicable IRS regulations 
            and state laws. Individual results may vary. Consult a licensed tax professional 
            for specific tax advice.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 TaxForm Pro. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}