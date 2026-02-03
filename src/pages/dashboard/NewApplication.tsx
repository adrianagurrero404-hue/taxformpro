import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Check
} from "lucide-react";

interface FormType {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
}

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
}

export default function NewApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // W2 specific fields
  const [w2Data, setW2Data] = useState({
    tax_year: "2025",
    employer_ein: "",
    employer_name: "",
    employer_address: "",
    employee_name: "",
    employee_ssn: "",
    employee_address: "",
    annual_salary: "",
    using_w4_2020: false,
    working_multiple_jobs: false,
    dependant_total: "",
    other_income: "",
    deductions: "",
  });

  useEffect(() => {
    fetchFormTypes();
  }, []);

  useEffect(() => {
    if (selectedFormType) {
      fetchCustomFields(selectedFormType.id);
    }
  }, [selectedFormType]);

  async function fetchFormTypes() {
    try {
      const { data, error } = await supabase
        .from("form_types")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setFormTypes(data || []);
    } catch (error) {
      console.error("Error fetching form types:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomFields(formTypeId: string) {
    try {
      const { data, error } = await supabase
        .from("custom_form_fields")
        .select("*")
        .eq("form_type_id", formTypeId)
        .order("display_order");

      if (error) throw error;
      setCustomFields(data || []);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  }

  async function handleSubmit() {
    if (!selectedFormType || !user) return;

    setSubmitting(true);

    try {
      const allFormData = {
        ...w2Data,
        ...formData,
      };

      const { error } = await supabase.from("form_applications").insert({
        user_id: user.id,
        form_type_id: selectedFormType.id,
        form_data: allFormData,
        total_price: selectedFormType.base_price,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      navigate("/dashboard/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function renderCustomField(field: CustomField) {
    const value = formData[field.field_name] || "";

    switch (field.field_type) {
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.field_name]: e.target.value })
            }
            placeholder={field.field_label}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.field_name]: e.target.value })
            }
            placeholder="0.00"
          />
        );
      case "email":
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.field_name]: e.target.value })
            }
            placeholder="email@example.com"
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.field_name]: e.target.value })
            }
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.field_name]: e.target.value })
            }
            placeholder={field.field_label}
          />
        );
    }
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              <span className={`hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Select Form" : s === 2 ? "Fill Details" : "Review"}
              </span>
              {s < 3 && (
                <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Form Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold">Choose Your Form Type</h1>
              <p className="text-muted-foreground mt-1">
                Select the tax form you need to generate
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {formTypes.map((form) => (
                  <Card
                    key={form.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedFormType?.id === form.id
                        ? "ring-2 ring-accent border-accent"
                        : ""
                    }`}
                    onClick={() => setSelectedFormType(form)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-accent/10 text-accent">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{form.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.description}
                          </p>
                          <p className="text-lg font-bold text-accent mt-2">
                            ${form.base_price}
                          </p>
                        </div>
                        {selectedFormType?.id === form.id && (
                          <Check className="h-5 w-5 text-accent" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedFormType}
                className="bg-accent hover:bg-accent/90"
              >
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Form Details */}
        {step === 2 && selectedFormType && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold">
                {selectedFormType.name} Details
              </h1>
              <p className="text-muted-foreground mt-1">
                Fill in the required information
              </p>
            </div>

            {/* Custom Fields from Admin */}
            {customFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>
                        {field.field_label}
                        {field.is_required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {renderCustomField(field)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* W2 Specific Fields */}
            {selectedFormType.name === "W-2" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Employer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tax Year *</Label>
                        <Input
                          value={w2Data.tax_year}
                          onChange={(e) => setW2Data({ ...w2Data, tax_year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Employer Identification Number (EIN) *</Label>
                        <Input
                          placeholder="XX-XXXXXXX"
                          value={w2Data.employer_ein}
                          onChange={(e) => setW2Data({ ...w2Data, employer_ein: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Business Name *</Label>
                      <Input
                        placeholder="Company Name"
                        value={w2Data.employer_name}
                        onChange={(e) => setW2Data({ ...w2Data, employer_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Address *</Label>
                      <Input
                        placeholder="Ex. 3305 Mt. Vernon Ct."
                        value={w2Data.employer_address}
                        onChange={(e) => setW2Data({ ...w2Data, employer_address: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. Employee Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Employee Full Name"
                          value={w2Data.employee_name}
                          onChange={(e) => setW2Data({ ...w2Data, employee_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Social Security Number (SSN)</Label>
                        <Input
                          placeholder="XXX-XX-1234"
                          value={w2Data.employee_ssn}
                          onChange={(e) => setW2Data({ ...w2Data, employee_ssn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Employee Address *</Label>
                      <Input
                        placeholder="Ex. 3305 Mt. Vernon Ct."
                        value={w2Data.employee_address}
                        onChange={(e) => setW2Data({ ...w2Data, employee_address: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Annual Salary *</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={w2Data.annual_salary}
                          onChange={(e) => setW2Data({ ...w2Data, annual_salary: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dependant Total (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={w2Data.dependant_total}
                          onChange={(e) => setW2Data({ ...w2Data, dependant_total: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Other Income Amount (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={w2Data.other_income}
                          onChange={(e) => setW2Data({ ...w2Data, other_income: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deductions Amount (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={w2Data.deductions}
                          onChange={(e) => setW2Data({ ...w2Data, deductions: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Generic form for other types */}
            {selectedFormType.name !== "W-2" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Form Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Recipient Name *</Label>
                    <Input
                      placeholder="Full Name"
                      value={formData.recipient_name || ""}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Identification Number</Label>
                    <Input
                      placeholder="XXX-XX-XXXX"
                      value={formData.tin || ""}
                      onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-accent hover:bg-accent/90">
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Submit */}
        {step === 3 && selectedFormType && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold">Review Your Application</h1>
              <p className="text-muted-foreground mt-1">
                Please review your information before submitting
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  {selectedFormType.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedFormType.name === "W-2" ? (
                    <>
                      <ReviewItem label="Tax Year" value={w2Data.tax_year} />
                      <ReviewItem label="Employer EIN" value={w2Data.employer_ein || "-"} />
                      <ReviewItem label="Employer Name" value={w2Data.employer_name || "-"} />
                      <ReviewItem label="Employee Name" value={w2Data.employee_name || "-"} />
                      <ReviewItem label="Annual Salary" value={`$${w2Data.annual_salary || "0"}`} />
                    </>
                  ) : (
                    <>
                      <ReviewItem label="Recipient Name" value={formData.recipient_name || "-"} />
                      <ReviewItem label="Amount" value={`$${formData.amount || "0"}`} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Order Total</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${selectedFormType.base_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      You will be able to manually edit the numbers in the next step
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                size="lg"
                className="bg-accent hover:bg-accent/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
