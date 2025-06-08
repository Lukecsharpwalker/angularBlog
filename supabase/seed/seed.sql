-- --------------------------------------------
-- UTF-8 seed file for a fresh Supabase project
-- --------------------------------------------
SET client_encoding = 'UTF8';
SET check_function_bodies = OFF;
SET client_min_messages = WARNING;

------------------------------------------------
-- 1. Tags (unchanged)
------------------------------------------------
INSERT INTO tags (id, name, color, icon) VALUES
                                           (1,'Angular','#DD0031','angular.svg'),
                                           (2,'TypeScript','#007ACC','typescript.svg'),
                                           (3,'JavaScript','#F7DF1E','javascript.svg'),
                                           (4,'Firebase','#FFCA28','firebase.svg'),
                                           (5,'Firestore','#FFA000','firestore.svg'),
                                           (6,'Node.js','#339933','nodejs.svg'),
                                           (7,'Cloud Computing','#4285F4','cloud-computing.svg'),
                                           (8,'SSG/SSR','#9E9E9E','ssg.svg'),
                                           (9,'Web Development','#E65100','web-development.svg'),
                                           (10,'Performance','#43A047','performance.svg'),
                                           (11,'Security','#D32F2F','security.svg'),
                                           (12,'Deployment','#1976D2','deployment.svg'),
                                           (13,'Testing','#8E24AA','testing.svg'),
                                           (14,'Best Practices','#FFB300','best-practices.svg'),
                                           (15,'Tutorials','#5E35B1','tutorials.svg'),
                                           (16,'HTML','#E44D26','html.svg'),
                                           (17,'CSS','#1572B6','css.svg')
  ON CONFLICT (id) DO NOTHING;

------------------------------------------------
-- 2. Users  (bcrypt via pgcrypto.crypt)
------------------------------------------------
WITH users AS (
  SELECT * FROM ( VALUES
                    ('00000000-0000-4000-8000-000000000001'::uuid, 'user@example.com',  'Password123!',
                     '{"provider":"email","providers":["email"]}'::jsonb),
                    ('00000000-0000-4000-8000-000000000002'::uuid, 'admin@example.com', 'Admin123!',
                     '{"provider":"email","providers":["email"],"role":"Admin"}'::jsonb)
                ) AS t(id,email,plain_pw,app_meta)
)
INSERT INTO auth.users (
  id,            instance_id,
  aud,           role,
  email,         encrypted_password,
  email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at,    updated_at,
  -- tokens & change fields (must not be NULL in Gotrue)
  confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT
  id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated','authenticated',
  email,
  crypt(plain_pw, gen_salt('bf')),     -- bcrypt hash:contentReference[oaicite:5]{index=5}
  now(),
  app_meta, '{}'::jsonb,
  now(), now(),
  '', '', '', ''
FROM users
  ON CONFLICT (id) DO NOTHING;

------------------------------------------------
-- 3. Identities  (provider_id is REQUIRED) 👈
------------------------------------------------
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,          -- NEW in Gotrue v2.173+:contentReference[oaicite:6]{index=6}
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),    -- identity row id
  u.id,
  u.id,                 -- provider_id == user id for 'email' provider:contentReference[oaicite:7]{index=7}
  'email',
  json_build_object('sub', u.id, 'email', u.email),
  now(), now(), now()
FROM auth.users u
WHERE u.email IN ('user@example.com','admin@example.com')
  ON CONFLICT (provider_id, provider) DO NOTHING;
------------------------------------------------
-- 4. Profiles  (one row per user)
------------------------------------------------
INSERT INTO public.profiles (id, username, created_at)
SELECT
  id,
  split_part(email, '@', 1) AS username,   -- “user” → user@example.com
  now()
FROM auth.users
  ON CONFLICT (id) DO NOTHING;
