#!/usr/bin/env tsx

import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

type Row = Record<string, unknown>;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const DEMO_USERS = [
  { id: '00000000-0000-4000-8000-000000000001', email: 'user@example.com', pw: 'Password123!', role: null },
  { id: '00000000-0000-4000-8000-000000000002', email: 'admin@example.com', pw: 'Admin123!', role: 'Admin' },
];

const quote = (value: unknown): string => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  return `'${String(value).replace(/'/g, "''")}'`;
};

const insert = (table: string, rows: Row[], conflict: string): string =>
  rows.length === 0
    ? ''
    : `INSERT INTO ${table} (${Object.keys(rows[0]).join(', ')}) VALUES\n` +
      rows.map(row => `  (${Object.values(row).map(quote).join(', ')})`).join(',\n') +
      `\n  ON CONFLICT ${conflict} DO NOTHING;`;

const authUsers = (users: { id: string; email: string; pw: string; role: string | null }[]): string =>
  `WITH seed_users AS (\n  SELECT * FROM ( VALUES\n` +
  users
    .map(
      u =>
        `    (${quote(u.id)}::uuid, ${quote(u.email)}, ${quote(u.pw)}, ` +
        `${quote({ provider: 'email', providers: ['email'], ...(u.role ? { role: u.role } : {}) })})`
    )
    .join(',\n') +
  `\n  ) AS t(id, email, plain_pw, app_meta)\n)\n` +
  `INSERT INTO auth.users (\n` +
  `  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,\n` +
  `  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,\n` +
  `  confirmation_token, email_change, email_change_token_new, recovery_token\n` +
  `)\nSELECT\n` +
  `  id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',\n` +
  `  email, crypt(plain_pw, gen_salt('bf')), now(), app_meta, '{}'::jsonb, now(), now(),\n` +
  `  '', '', '', ''\nFROM seed_users\n  ON CONFLICT (id) DO NOTHING;\n\n` +
  `INSERT INTO auth.identities (\n` +
  `  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at\n` +
  `)\nSELECT\n` +
  `  gen_random_uuid(), u.id, u.id, 'email',\n` +
  `  json_build_object('sub', u.id, 'email', u.email), now(), now(), now()\n` +
  `FROM auth.users u\n  ON CONFLICT (provider_id, provider) DO NOTHING;`;

const main = async () => {
  const env = await readFile(join(root, 'environments', 'environment.ts'), 'utf8');
  const url = env.match(/supabaseUrl:\s*'([^']+)'/)?.[1];
  const key = env.match(/supabaseKey:\s*\n?\s*'([^']+)'/)?.[1];
  if (!url || !key) throw new Error('No supabaseUrl or supabaseKey in environments/environment.ts');

  const get = async (table: string): Promise<Row[]> => {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`${table}: ${response.status} ${await response.text()}`);
    return response.json();
  };

  const [tags, profiles, posts, postTags, comments] = await Promise.all(
    ['tags', 'profiles', 'posts', 'post_tags', 'comments'].map(get)
  );

  const emails = new Set(DEMO_USERS.map(u => u.email));
  const users = [
    ...DEMO_USERS,
    ...profiles.map(profile => {
      const base = String(profile['username'] ?? 'user')
        .trim()
        .split(/\s+/)[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      let email = `${base || 'user'}@example.com`;
      for (let i = 2; emails.has(email); i++) email = `${base}${i}@example.com`;
      emails.add(email);
      return { id: String(profile['id']), email, pw: 'Password123!', role: 'Admin' };
    }),
  ];

  const demoProfiles = DEMO_USERS.map(u => ({
    id: u.id,
    username: u.email.split('@')[0],
    avatar_url: null,
    created_at: new Date().toISOString(),
  }));

  const known = new Set(users.map(u => u.id));
  const keptPosts = posts.filter(post => known.has(String(post['user_id'])));
  const postIds = new Set(keptPosts.map(post => String(post['id'])));

  const sql = [
    insert('public.tags', tags, '(id)'),
    authUsers(users),
    insert('public.profiles', [...demoProfiles, ...profiles], '(id)'),
    insert('public.posts', keptPosts, '(id)'),
    insert(
      'public.post_tags',
      postTags.filter(pt => postIds.has(String(pt['post_id']))),
      '(post_id, tag_id)'
    ),
    insert(
      'public.comments',
      comments.filter(c => postIds.has(String(c['post_id']))),
      '(id)'
    ),
  ]
    .filter(Boolean)
    .join('\n\n');

  await writeFile(join(root, 'supabase', 'seed', 'seed.sql'), `${sql}\n`, 'utf8');
  console.log(`seed.sql: ${users.length} users, ${tags.length} tags, ${keptPosts.length} posts`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
