-- Create library_folders table first
CREATE TABLE public.library_folders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  nombre text NOT NULL,
  color text DEFAULT '#00d9ff',
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  parent_folder_id uuid REFERENCES public.library_folders(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.library_folders ENABLE ROW LEVEL SECURITY;

-- RLS policies for library_folders
CREATE POLICY "Users can view their own folders"
ON public.library_folders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders"
ON public.library_folders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
ON public.library_folders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
ON public.library_folders FOR DELETE
USING (auth.uid() = user_id);

-- Add folder_id column to library_files
ALTER TABLE public.library_files ADD COLUMN folder_id uuid REFERENCES public.library_folders(id) ON DELETE SET NULL;