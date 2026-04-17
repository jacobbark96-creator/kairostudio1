CREATE TABLE public.bali_chatbot_questions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_index integer NOT NULL,
    question_text text NOT NULL
);

ALTER TABLE public.bali_chatbot_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.bali_chatbot_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.bali_chatbot_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.bali_chatbot_questions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.bali_chatbot_questions FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE public.bali_chatbot_responses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    responses jsonb NOT NULL
);

ALTER TABLE public.bali_chatbot_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert access for all users" ON public.bali_chatbot_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated users only" ON public.bali_chatbot_responses FOR SELECT USING (auth.role() = 'authenticated');
