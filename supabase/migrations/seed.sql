-- Seed data for the blog application

-- Create a test admin user
-- Note: In a real application, you would use a secure password
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"],"role":"Admin"}',
  '{"name":"Admin User"}'
) ON CONFLICT DO NOTHING;

-- Create some sample tags
INSERT INTO public.tags (name) VALUES
  ('Angular'),
  ('TypeScript'),
  ('Supabase'),
  ('Web Development'),
  ('Frontend')
ON CONFLICT (name) DO NOTHING;

-- Note: The profiles table will be populated automatically by the trigger
-- when users are created. The posts, comments, and post_tags tables
-- can be populated through the application interface by the admin user.
