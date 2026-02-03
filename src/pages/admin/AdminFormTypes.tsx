import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Edit2, Trash2, GripVertical, FileText } from "lucide-react";

interface FormType {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
}

interface CustomField {
  id: string;
  form_type_id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  display_order: number;
}

export default function AdminFormTypes() {
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for editing form type
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    base_price: 14.99,
    is_active: true,
  });

  // Form state for adding custom field
  const [newField, setNewField] = useState({
    field_name: "",
    field_label: "",
    field_type: "text",
    is_required: false,
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
        .order("name");

      if (error) throw error;
      setFormTypes(data || []);
      if (data && data.length > 0 && !selectedFormType) {
        setSelectedFormType(data[0]);
      }
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

  async function updateFormType() {
    if (!selectedFormType) return;

    try {
      const { error } = await supabase
        .from("form_types")
        .update({
          name: editForm.name,
          description: editForm.description,
          base_price: editForm.base_price,
          is_active: editForm.is_active,
        })
        .eq("id", selectedFormType.id);

      if (error) throw error;

      toast({ title: "Form type updated successfully" });
      setEditDialogOpen(false);
      fetchFormTypes();
    } catch (error) {
      console.error("Error updating form type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update form type",
      });
    }
  }

  async function addCustomField() {
    if (!selectedFormType) return;

    try {
      const { error } = await supabase.from("custom_form_fields").insert({
        form_type_id: selectedFormType.id,
        field_name: newField.field_name.toLowerCase().replace(/\s+/g, "_"),
        field_label: newField.field_label,
        field_type: newField.field_type,
        is_required: newField.is_required,
        display_order: customFields.length,
      });

      if (error) throw error;

      toast({ title: "Custom field added" });
      setFieldDialogOpen(false);
      setNewField({
        field_name: "",
        field_label: "",
        field_type: "text",
        is_required: false,
      });
      fetchCustomFields(selectedFormType.id);
    } catch (error) {
      console.error("Error adding custom field:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom field",
      });
    }
  }

  async function deleteCustomField(fieldId: string) {
    try {
      const { error } = await supabase
        .from("custom_form_fields")
        .delete()
        .eq("id", fieldId);

      if (error) throw error;

      toast({ title: "Field deleted" });
      if (selectedFormType) {
        fetchCustomFields(selectedFormType.id);
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete field",
      });
    }
  }

  function openEditDialog(formType: FormType) {
    setEditForm({
      name: formType.name,
      description: formType.description || "",
      base_price: formType.base_price,
      is_active: formType.is_active,
    });
    setEditDialogOpen(true);
  }

  const fieldTypeLabels: Record<string, string> = {
    text: "Text",
    number: "Number",
    email: "Email",
    file: "File Upload",
    image: "Image Upload",
    textarea: "Text Area",
    select: "Dropdown",
    date: "Date",
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Form Types
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage form types and their custom fields
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Types List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Available Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formTypes.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedFormType(form)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedFormType?.id === form.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{form.name}</p>
                    <p className={`text-sm ${
                      selectedFormType?.id === form.id 
                        ? "text-accent-foreground/70" 
                        : "text-muted-foreground"
                    }`}>
                      ${form.base_price}
                    </p>
                  </div>
                  {!form.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Form Details & Custom Fields */}
          <Card className="lg:col-span-2">
            {selectedFormType ? (
              <>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedFormType.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {selectedFormType.description || "No description"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(selectedFormType)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Form Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${selectedFormType.base_price}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`text-lg font-semibold ${
                        selectedFormType.is_active ? "text-success" : "text-muted-foreground"
                      }`}>
                        {selectedFormType.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Custom Fields</h3>
                      <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-accent hover:bg-accent/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Field
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Custom Field</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Field Label</Label>
                              <Input
                                value={newField.field_label}
                                onChange={(e) =>
                                  setNewField({ ...newField, field_label: e.target.value })
                                }
                                placeholder="e.g., Driver's License"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field Name (ID)</Label>
                              <Input
                                value={newField.field_name}
                                onChange={(e) =>
                                  setNewField({ ...newField, field_name: e.target.value })
                                }
                                placeholder="e.g., drivers_license"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field Type</Label>
                              <Select
                                value={newField.field_type}
                                onValueChange={(value) =>
                                  setNewField({ ...newField, field_type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(fieldTypeLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newField.is_required}
                                onCheckedChange={(checked) =>
                                  setNewField({ ...newField, is_required: checked })
                                }
                              />
                              <Label>Required field</Label>
                            </div>
                            <Button onClick={addCustomField} className="w-full bg-accent hover:bg-accent/90">
                              Add Field
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {customFields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No custom fields added yet</p>
                        <p className="text-sm">Add fields that users need to fill out</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {customFields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{field.field_label}</p>
                              <p className="text-sm text-muted-foreground">
                                {fieldTypeLabels[field.field_type]} •{" "}
                                {field.is_required ? "Required" : "Optional"}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCustomField(field.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center text-muted-foreground">
                Select a form type to view details
              </CardContent>
            )}
          </Card>
        </div>

        {/* Edit Form Type Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Form Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Base Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.base_price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, base_price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editForm.is_active}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, is_active: checked })
                  }
                />
                <Label>Active (available for users)</Label>
              </div>
              <Button onClick={updateFormType} className="w-full bg-accent hover:bg-accent/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
