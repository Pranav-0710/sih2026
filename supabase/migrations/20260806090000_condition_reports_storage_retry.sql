-- Retry: storage bucket + policies for condition-reports.
-- The condition_reports TABLE already exists (confirmed via REST API), but
-- the storage bucket did not get created — likely the original script hit
-- an error partway through and stopped before this section ran.
-- This version is idempotent: safe to run even if some of it already exists.

INSERT INTO storage.buckets (id, name, public)
VALUES ('condition-reports', 'condition-reports', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view condition report photos" ON storage.objects;
CREATE POLICY "Anyone can view condition report photos" ON storage.objects FOR SELECT
    USING (bucket_id = 'condition-reports');

DROP POLICY IF EXISTS "Authenticated users can upload condition report photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload condition report photos" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'condition-reports' AND auth.role() = 'authenticated');
