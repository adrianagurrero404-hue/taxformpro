import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Building2, 
  User, 
  DollarSign, 
  Mail,
  Download,
  Check,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentFrequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly (ex: Every Friday)" },
  { value: "biweekly", label: "Bi-Weekly (ex: every other Wednesday)" },
  { value: "semimonthly", label: "Semi-Monthly (ex: 1st and 16th)" },
  { value: "monthly", label: "Monthly (ex: 1st of month only)" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semiannually", label: "Semi-Annually" },
  { value: "annually", label: "Annually" },
];

const taxExemptions = [
  { id: "federal", label: "Federal Tax" },
  { id: "state", label: "State Tax" },
  { id: "social_security", label: "Social Security" },
  { id: "medicare", label: "Medicare" },
];

export default function Paystub() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Company
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEIN: "",
    companyLogo: null as File | null,
    
    // Employee
    employeeStatus: "employee",
    employeeName: "",
    employeeSSN: "",
    employeeAddress: "",
    employeeId: "",
    federalFilingStatus: "single",
    stateFilingStatus: "single",
    workingFromHome: false,
    
    // Salary
    paymentType: "hourly",
    paymentFrequency: "biweekly",
    hourlyRate: "",
    salary: "",
    hireDate: "",
    payDatesCount: 1,
    
    // Exemptions
    exemptions: [] as string[],
    
    // Options
    addDirectDeposit: true,
    
    // Email
    email: "",
  });

  function updateField(field: string, value: any) {
    setFormData({ ...formData, [field]: value });
  }

  function toggleExemption(exemptionId: string) {
    const current = formData.exemptions;
    if (current.includes(exemptionId)) {
      updateField("exemptions", current.filter(e => e !== exemptionId));
    } else {
      updateField("exemptions", [...current, exemptionId]);
    }
  }

  function generatePayDates() {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);

    for (let i = 0; i < formData.payDatesCount; i++) {
      dates.push(new Date(currentDate));
      
      switch (formData.paymentFrequency) {
        case "daily":
          currentDate.setDate(currentDate.getDate() - 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() - 7);
          break;
        case "biweekly":
          currentDate.setDate(currentDate.getDate() - 14);
          break;
        case "semimonthly":
          currentDate.setDate(currentDate.getDate() - 15);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() - 1);
          break;
        case "quarterly":
          currentDate.setMonth(currentDate.getMonth() - 3);
          break;
        case "semiannually":
          currentDate.setMonth(currentDate.getMonth() - 6);
          break;
        case "annually":
          currentDate.setFullYear(currentDate.getFullYear() - 1);
          break;
      }
    }
    return dates;
  }

  function handleSubmit() {
    if (!formData.companyName || !formData.employeeName || !formData.email) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    toast({
      title: "Paystub submitted!",
      description: "You will receive your paystub via email shortly.",
    });
  }

  const payDates = generatePayDates();

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
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Create Your Stub
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Enter your details and we'll handle the calculations for you
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">1</div>
              <span>Create</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">2</div>
              <span>Customize</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">3</div>
              <span>Download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => updateField("companyName", e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Address *</Label>
                      <Input
                        value={formData.companyAddress}
                        onChange={(e) => updateField("companyAddress", e.target.value)}
                        placeholder="123 Main St, City, State ZIP"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Phone Number (Optional)</Label>
                      <Input
                        value={formData.companyPhone}
                        onChange={(e) => updateField("companyPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EIN (Optional)</Label>
                      <Input
                        value={formData.companyEIN}
                        onChange={(e) => updateField("companyEIN", e.target.value)}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Employee Status *</Label>
                    <RadioGroup
                      value={formData.employeeStatus}
                      onValueChange={(value) => updateField("employeeStatus", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employee" id="employee" />
                        <Label htmlFor="employee">Employee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contractor" id="contractor" />
                        <Label htmlFor="contractor">Contractor</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Employee Full Name *</Label>
                      <Input
                        value={formData.employeeName}
                        onChange={(e) => updateField("employeeName", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last 4 Digits of SSN (Optional)</Label>
                      <Input
                        value={formData.employeeSSN}
                        onChange={(e) => updateField("employeeSSN", e.target.value)}
                        placeholder="1234"
                        maxLength={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        This data is stored securely and never shared.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.workingFromHome}
                      onCheckedChange={(checked) => updateField("workingFromHome", checked)}
                    />
                    <Label>Employee is working from home</Label>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-2">
                    By choosing this option, taxes will be calculated based on the employee's address.
                  </p>
                </CardContent>
              </Card>

              {/* Salary Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    Salary Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Type *</Label>
                    <RadioGroup
                      value={formData.paymentType}
                      onValueChange={(value) => updateField("paymentType", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly">Hourly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salary" id="salary" />
                        <Label htmlFor="salary">Salary</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Payment Frequency</Label>
                      <Select
                        value={formData.paymentFrequency}
                        onValueChange={(value) => updateField("paymentFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentFrequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{formData.paymentType === "hourly" ? "Hourly Rate *" : "Annual Salary *"}</Label>
                      <Input
                        type="number"
                        value={formData.paymentType === "hourly" ? formData.hourlyRate : formData.salary}
                        onChange={(e) => updateField(
                          formData.paymentType === "hourly" ? "hourlyRate" : "salary", 
                          e.target.value
                        )}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Hire Date (Optional)</Label>
                      <Input
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => updateField("hireDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>How many Pay Dates?</Label>
                      <Select
                        value={formData.payDatesCount.toString()}
                        onValueChange={(value) => updateField("payDatesCount", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 26 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pay Dates Preview */}
                  {formData.payDatesCount > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <p className="text-sm font-medium">Generated Pay Dates:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                        {payDates.slice(0, 6).map((date, i) => (
                          <div key={i} className="p-2 bg-background rounded border border-border">
                            Pay Date {i + 1}: {date.toLocaleDateString()}
                          </div>
                        ))}
                        {payDates.length > 6 && (
                          <div className="p-2 text-muted-foreground">
                            +{payDates.length - 6} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tax Exemptions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Tax Exemptions (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Is the employee exempt from any taxes?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {taxExemptions.map((exemption) => (
                      <div key={exemption.id} className="flex items-center gap-2">
                        <Switch
                          checked={formData.exemptions.includes(exemption.id)}
                          onCheckedChange={() => toggleExemption(exemption.id)}
                        />
                        <Label>{exemption.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Direct Deposit */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Switch
                      checked={formData.addDirectDeposit}
                      onCheckedChange={(checked) => updateField("addDirectDeposit", checked)}
                    />
                    <div>
                      <Label className="text-base">Add Direct Deposit Slip (Recommended)</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Include a detachable deposit slip at the bottom of the paystub with the 
                        employee's/contractor's net pay and check number. Perfect for record-keeping.
                      </p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                        73% of our customers choose this option
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-accent" />
                    Email Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Your Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      You will receive your stub(s) to this email address.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Submit */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Your Stub Preview</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                      (Click to enlarge view)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[3/4] bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <div className="text-center p-4">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Preview will appear here
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Change template
                    </Button>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span>Order</span>
                      <span>{formData.payDatesCount}x Stubs</span>
                    </div>
                    <Button 
                      onClick={handleSubmit}
                      className="w-full bg-accent hover:bg-accent/90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Submit & Download
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
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