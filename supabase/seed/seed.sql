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

WITH posts_data (id, title, description, created_at) AS (
  VALUES
    ('10000000-0000-4000-8000-000000000001'::uuid,
     'Lorem Ipsum: A Complete Guide to Dolor Sit Amet',
     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A long read through every corner of dolor sit amet.',
     '2026-08-01 09:00:00+00'::timestamptz),
    ('10000000-0000-4000-8000-000000000002'::uuid,
     'Consectetur Adipiscing in Practice',
     'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, explained step by step with real examples.',
     '2026-08-08 09:00:00+00'::timestamptz),
    ('10000000-0000-4000-8000-000000000003'::uuid,
     'Advanced Patterns of Eiusmod Tempor',
     'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
     '2026-08-15 09:00:00+00'::timestamptz),
    ('10000000-0000-4000-8000-000000000004'::uuid,
     'Mastering Ut Enim Ad Minim Veniam',
     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
     '2026-08-22 09:00:00+00'::timestamptz),
    ('10000000-0000-4000-8000-000000000005'::uuid,
     'Excepteur Sint Occaecat: A Deep Dive',
     'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
     '2026-08-29 09:00:00+00'::timestamptz)
),
texts AS (
  SELECT
    ARRAY[
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
      'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
    ] AS paragraphs,
    ARRAY[
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor',
      'Ut enim ad minim veniam',
      'Duis aute irure dolor',
      'Excepteur sint occaecat',
      'Nemo enim ipsam voluptatem',
      'Neque porro quisquam'
    ] AS section_titles,
    ARRAY[
      'Quis nostrud exercitation',
      'Ullamco laboris nisi',
      'Voluptate velit esse',
      'Cillum dolore eu fugiat'
    ] AS subsection_titles
),
sections AS (
  SELECT
    pd.id AS post_id,
    s.section_no,
    t.paragraphs,
    t.section_titles[s.section_no] AS h2_title,
    format('%s %s', t.subsection_titles[1 + s.section_no % 4], s.section_no) AS h3_title,
    row_number() OVER (ORDER BY pd.id) AS post_no
  FROM posts_data pd
  CROSS JOIN texts t
  CROSS JOIN generate_series(1, 8) AS s(section_no)
),
rendered AS (
  SELECT
    post_id,
    section_no,
    h2_title,
    h3_title,
    lower(regexp_replace(h2_title, '\s+', '-', 'g')) AS h2_id,
    lower(regexp_replace(h3_title, '\s+', '-', 'g')) AS h3_id,
    paragraphs[1 + (section_no + post_no) % 6] AS p1,
    paragraphs[1 + (section_no + post_no + 1) % 6] AS p2,
    paragraphs[1 + (section_no + post_no + 2) % 6] AS p3,
    paragraphs[1 + (section_no + post_no + 3) % 6] AS p4,
    paragraphs[1 + (section_no + post_no + 4) % 6] AS p5,
    CASE section_no
      WHEN 3 THEN '<pre data-language="typescript"><code class="hljs language-typescript">const lorem = ipsum.filter(dolor => dolor.sit).map(amet => amet.consectetur);</code></pre>'
      WHEN 5 THEN '<blockquote>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</blockquote>'
      WHEN 7 THEN '<ul><li>Lorem ipsum dolor sit amet</li><li>Consectetur adipiscing elit</li><li>Sed do eiusmod tempor incididunt</li></ul>'
      ELSE ''
    END AS extra_block
  FROM sections
)
INSERT INTO public.posts (id, user_id, title, description, content, is_draft, created_at, table_of_contents)
SELECT
  pd.id,
  '00000000-0000-4000-8000-000000000002',
  pd.title,
  pd.description,
  (
    SELECT string_agg(
      format(
        '<h2 id="%s">%s</h2><p>%s</p><p>%s</p><p>%s</p><h3 id="%s">%s</h3><p>%s</p>%s<p>%s</p>',
        r.h2_id, r.h2_title, r.p1, r.p2, r.p3, r.h3_id, r.h3_title, r.p4, r.extra_block, r.p5
      ),
      '' ORDER BY r.section_no
    )
    FROM rendered r
    WHERE r.post_id = pd.id
  ),
  false,
  pd.created_at,
  (
    SELECT jsonb_object_agg(toc.entry_key, toc.entry)
    FROM (
      SELECT (r.section_no * 2)::text AS entry_key,
             jsonb_build_object('content', r.h2_title, 'header', 2, 'id', r.h2_id) AS entry
      FROM rendered r
      WHERE r.post_id = pd.id
      UNION ALL
      SELECT (r.section_no * 2 + 1)::text,
             jsonb_build_object('content', r.h3_title, 'header', 3, 'id', r.h3_id)
      FROM rendered r
      WHERE r.post_id = pd.id
    ) AS toc
  )
FROM posts_data pd
  ON CONFLICT (id) DO NOTHING;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  ('10000000-0000-4000-8000-000000000001', 1),
  ('10000000-0000-4000-8000-000000000001', 15),
  ('10000000-0000-4000-8000-000000000002', 2),
  ('10000000-0000-4000-8000-000000000002', 14),
  ('10000000-0000-4000-8000-000000000003', 1),
  ('10000000-0000-4000-8000-000000000003', 10),
  ('10000000-0000-4000-8000-000000000004', 8),
  ('10000000-0000-4000-8000-000000000004', 12),
  ('10000000-0000-4000-8000-000000000005', 11),
  ('10000000-0000-4000-8000-000000000005', 13)
  ON CONFLICT (post_id, tag_id) DO NOTHING;
