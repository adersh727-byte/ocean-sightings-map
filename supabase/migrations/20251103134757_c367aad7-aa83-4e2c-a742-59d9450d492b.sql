-- Fix search_path for handle_updated_at function by dropping cascade
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger for debris_reports table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.debris_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();