-- Crowdsourced monastery condition reporting (Monastery360 / SIH25061)
-- Tourists and locals submit a report on a monastery's condition; an edge
-- function (classify-condition) runs AI severity triage on submission and
-- fills in severity + severity_confidence. Admins view reports ranked by
-- severity in the Dashboard.

CREATE TABLE public.condition_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    monastery_id TEXT NOT NULL,
    monastery_name TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    lat DECIMAL(10, 8),
    lon DECIMAL(11, 8),
    severity TEXT CHECK (severity IN ('urgent structural damage', 'moderate wear', 'minor issue', 'no concern')),
    severity_confidence DECIMAL(5, 4),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX condition_reports_severity_idx ON public.condition_reports (severity);
CREATE INDEX condition_reports_monastery_idx ON public.condition_reports (monastery_id);

ALTER TABLE public.condition_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view condition reports" ON public.condition_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit condition reports" ON public.condition_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can update condition reports" ON public.condition_reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.user_type = 'admin')
);

-- Storage bucket for condition-report photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('condition-reports', 'condition-reports', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view condition report photos" ON storage.objects FOR SELECT
    USING (bucket_id = 'condition-reports');

CREATE POLICY "Authenticated users can upload condition report photos" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'condition-reports' AND auth.role() = 'authenticated');
