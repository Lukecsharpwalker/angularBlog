drop extension if exists "pg_net";

drop policy "Only Admin can delete comments" on "public"."comments";

drop policy "Only Admin can update post_tags" on "public"."post_tags";

drop policy "Users can delete their own profile or Admin" on "public"."profiles";

drop policy "Users can edit their own profile or Admin" on "public"."profiles";

drop policy "Only Admin can delete tags" on "public"."tags";

drop policy "Only Admin can update tags" on "public"."tags";

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'exporter') then
    create role exporter;
  end if;
end;
$$;

alter table "public"."posts" add column "cover_image" text not null default 'https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/covers/ChatGPT%20Image%2011%20sie%202026,%2020_53_29.png'::text;

grant select on table "public"."comments" to "exporter";

grant select on table "public"."post_tags" to "exporter";

grant select on table "public"."posts" to "exporter";

grant select on table "public"."profiles" to "exporter";

grant select on table "public"."tags" to "exporter";


  create policy "Only Admin can delete comments"
  on "public"."comments"
  as permissive
  for delete
  to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text));



  create policy "Only Admin can update post_tags"
  on "public"."post_tags"
  as permissive
  for update
  to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text));



  create policy "Users can delete their own profile or Admin"
  on "public"."profiles"
  as permissive
  for delete
  to public
using (((auth.uid() = id) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text)));



  create policy "Users can edit their own profile or Admin"
  on "public"."profiles"
  as permissive
  for update
  to public
using (((auth.uid() = id) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text)));



  create policy "Only Admin can delete tags"
  on "public"."tags"
  as permissive
  for delete
  to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text));



  create policy "Only Admin can update tags"
  on "public"."tags"
  as permissive
  for update
  to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'Admin'::text));


