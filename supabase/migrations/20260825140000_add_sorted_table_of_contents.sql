create or replace function public.table_of_contents_sorted(post public.posts)
returns jsonb
language sql
stable
as $$
  select coalesce(
    jsonb_agg(entry_value order by entry_key::integer),
    '[]'::jsonb
  )
  from jsonb_each(post.table_of_contents) as entry(entry_key, entry_value);
$$;

grant execute on function public.table_of_contents_sorted(public.posts) to anon, authenticated;
