import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, X, File, Image, Loader2 } from "lucide-react";

interface FileUploadProps {
  userId: string;
  fieldName: string;
  accept?: string;
  onUpload: (url: string, fileName: string) => void;
  existingFile?: { url: string; name: string } | null;
}

export function FileUpload({ 
  userId, 
  fieldName, 
  accept = "*", 
  onUpload,
  existingFile 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingFile?.url || null);
  const [fileName, setFileName] = useState<string>(existingFile?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isImageAccept = accept.includes("image");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  }

  async function uploadFile(file: File) {
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${fieldName}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("application-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("application-files")
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      setFileName(file.name);
      onUpload(publicUrl, file.name);

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    setPreview(null);
    setFileName("");
    onUpload("", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            {isImageAccept && preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center">
                <File className="h-8 w-8 text-accent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName}</p>
              <p className="text-sm text-muted-foreground">Uploaded successfully</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-${fieldName}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isImageAccept ? (
              <Image className="h-4 w-4 mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? "Uploading..." : "Choose File"}
          </Button>

          {/* Camera Input for mobile */}
          {isImageAccept && (
            <>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id={`camera-${fieldName}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 sm:flex-none"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}