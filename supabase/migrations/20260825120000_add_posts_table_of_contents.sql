alter table "public"."posts" add column "table_of_contents" jsonb not null default '[]'::jsonb;
