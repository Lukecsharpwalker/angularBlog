create policy "Authenticated users can create their own comments"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);
