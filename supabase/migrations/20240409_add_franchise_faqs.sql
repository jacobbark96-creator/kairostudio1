CREATE TABLE IF NOT EXISTS public.franchise_faqs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.franchise_faqs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view franchise_faqs" ON public.franchise_faqs;
DROP POLICY IF EXISTS "Admins can manage franchise_faqs" ON public.franchise_faqs;

-- Public can read
CREATE POLICY "Public can view franchise_faqs" 
    ON public.franchise_faqs FOR SELECT 
    USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage franchise_faqs" 
    ON public.franchise_faqs FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'super_admin')
        )
    );
