-- Add partial exam grades columns to user_subject_status
ALTER TABLE public.user_subject_status
ADD COLUMN IF NOT EXISTS nota_parcial_1 numeric CHECK (nota_parcial_1 IS NULL OR (nota_parcial_1 >= 0 AND nota_parcial_1 <= 100)),
ADD COLUMN IF NOT EXISTS nota_rec_parcial_1 numeric CHECK (nota_rec_parcial_1 IS NULL OR (nota_rec_parcial_1 >= 0 AND nota_rec_parcial_1 <= 100)),
ADD COLUMN IF NOT EXISTS nota_parcial_2 numeric CHECK (nota_parcial_2 IS NULL OR (nota_parcial_2 >= 0 AND nota_parcial_2 <= 100)),
ADD COLUMN IF NOT EXISTS nota_rec_parcial_2 numeric CHECK (nota_rec_parcial_2 IS NULL OR (nota_rec_parcial_2 >= 0 AND nota_rec_parcial_2 <= 100)),
ADD COLUMN IF NOT EXISTS nota_global numeric CHECK (nota_global IS NULL OR (nota_global >= 0 AND nota_global <= 100)),
ADD COLUMN IF NOT EXISTS nota_rec_global numeric CHECK (nota_rec_global IS NULL OR (nota_rec_global >= 0 AND nota_rec_global <= 100)),
ADD COLUMN IF NOT EXISTS nota_final_examen numeric CHECK (nota_final_examen IS NULL OR (nota_final_examen >= 0 AND nota_final_examen <= 100));

-- Add comments for clarity
COMMENT ON COLUMN public.user_subject_status.nota_parcial_1 IS 'Grade for first midterm exam (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_rec_parcial_1 IS 'Grade for first midterm retake (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_parcial_2 IS 'Grade for second midterm exam (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_rec_parcial_2 IS 'Grade for second midterm retake (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_global IS 'Grade for global exam (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_rec_global IS 'Grade for global retake exam (0-100)';
COMMENT ON COLUMN public.user_subject_status.nota_final_examen IS 'Grade for final exam (0-100)';