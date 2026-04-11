CREATE TABLE IF NOT EXISTS audit_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text text NOT NULL,
  option_1 text NOT NULL,
  option_2 text NOT NULL,
  option_3 text NOT NULL,
  order_index integer NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert 5 default questions
INSERT INTO audit_questions (question_text, option_1, option_2, option_3, order_index) VALUES
('What is your primary goal for your website?', 'Generate more leads', 'Increase online sales', 'Improve brand awareness', 1),
('How would you describe your current website design?', 'Outdated and needs a refresh', 'Modern but not converting well', 'Good, but looking for expert advice', 2),
('What is your biggest technical challenge?', 'Slow page load speeds', 'Mobile responsiveness issues', 'SEO and low search rankings', 3),
('Who is your target audience?', 'B2B (Business to Business)', 'B2C (Business to Consumer)', 'Both B2B and B2C', 4),
('What is your expected timeline for improvements?', 'As soon as possible (1-2 weeks)', 'Within the next month', 'Exploring options for the future', 5)
ON CONFLICT (order_index) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  option_1 = EXCLUDED.option_1,
  option_2 = EXCLUDED.option_2,
  option_3 = EXCLUDED.option_3;

ALTER TABLE audit_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read audit questions" ON audit_questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage audit questions" ON audit_questions
  FOR ALL USING (
    public.is_super_admin() OR 
    EXISTS (
      SELECT 1 FROM admin_permissions 
      WHERE user_id = auth.uid() AND allowed_tab = 'audit_qs'
    )
  );