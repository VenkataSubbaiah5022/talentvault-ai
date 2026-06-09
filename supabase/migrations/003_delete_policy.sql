-- Allow deleting candidates (used by server API with service role; included for RLS completeness)
create policy "Allow public delete candidates"
  on public.candidates for delete
  using (true);
