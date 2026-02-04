-- Create storage bucket for application files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('application-files', 'application-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for application-files bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-files' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'application-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'application-files' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Add delete policy for applications (soft delete or hard delete)
CREATE POLICY "Users can delete own pending applications"
ON public.form_applications FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can delete any application"
ON public.form_applications FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));