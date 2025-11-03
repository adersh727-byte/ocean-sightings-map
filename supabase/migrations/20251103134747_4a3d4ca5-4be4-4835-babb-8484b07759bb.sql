-- Create debris_reports table for tracking marine debris
CREATE TABLE public.debris_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  photo_url TEXT,
  debris_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.debris_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read debris reports (public viewing)
CREATE POLICY "Anyone can view debris reports"
  ON public.debris_reports
  FOR SELECT
  USING (true);

-- Allow authenticated users to create their own reports
CREATE POLICY "Authenticated users can create reports"
  ON public.debris_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reports
CREATE POLICY "Users can update their own reports"
  ON public.debris_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own reports
CREATE POLICY "Users can delete their own reports"
  ON public.debris_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.debris_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for debris photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('debris-photos', 'debris-photos', true);

-- Storage policies for debris photos
CREATE POLICY "Anyone can view debris photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'debris-photos');

CREATE POLICY "Authenticated users can upload debris photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'debris-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own photos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'debris-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'debris-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );