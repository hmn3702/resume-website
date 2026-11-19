-- ============================================================
-- 10: Rule - em dashes in project content become "-"
-- Enforced in the database, so it applies no matter where the
-- data is saved from (admin panel, SQL editor, API).
-- Run AFTER 09. Safe to re-run.
-- ============================================================

create or replace function public.projects_replace_em_dash()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.title       := replace(new.title,       chr(8212), '-');
  new.description := replace(new.description, chr(8212), '-');
  new.problem     := replace(new.problem,     chr(8212), '-');
  new.data        := replace(new.data,        chr(8212), '-');
  new.approach    := replace(new.approach,    chr(8212), '-');
  new.insights    := replace(new.insights,    chr(8212), '-');
  new.outcome     := replace(new.outcome,     chr(8212), '-');
  new.tech_stack  := array(
    select replace(t, chr(8212), '-')
    from unnest(new.tech_stack) with ordinality as u(t, i)
    order by i
  );
  return new;
end;
$$;

drop trigger if exists projects_replace_em_dash on public.projects;
create trigger projects_replace_em_dash
  before insert or update on public.projects
  for each row execute function public.projects_replace_em_dash();

-- One-time cleanup of existing rows (the trigger rewrites them on update)
update public.projects
set title = title
where position(chr(8212) in concat_ws(' ', title, description, problem, data, approach,
                                      insights, outcome, array_to_string(tech_stack, ' '))) > 0;

-- Should return 0:
-- select count(*) from public.projects
-- where position(chr(8212) in concat_ws(' ', title, description, problem, data, approach,
--                                       insights, outcome, array_to_string(tech_stack, ' '))) > 0;
