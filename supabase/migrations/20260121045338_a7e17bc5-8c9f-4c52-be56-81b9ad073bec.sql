-- Create storage bucket for library files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'library-files',
  'library-files', 
  true,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create policies for library storage
CREATE POLICY "Users can upload their own library files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'library-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own library files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'library-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own library files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'library-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view library files"
ON storage.objects FOR SELECT
USING (bucket_id = 'library-files');