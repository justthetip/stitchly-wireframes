create extension if not exists pgcrypto;

create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  designer text,
  craft text not null check (craft in ('knit', 'crochet')),
  difficulty text,
  yarn text,
  tool text,
  total_rows integer not null default 0 check (total_rows >= 0),
  source text not null default 'PDF',
  blob_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pattern_rows (
  id uuid primary key default gen_random_uuid(),
  pattern_id uuid not null references public.patterns(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  section text,
  instructions text not null,
  stitch_count integer,
  confidence text check (confidence in ('high', 'medium', 'low')),
  unique (pattern_id, row_number)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  pattern_id uuid not null references public.patterns(id) on delete restrict,
  name text not null,
  status text not null default 'active' check (status in ('planned', 'active', 'completed')),
  yarn text,
  current_row integer not null default 1 check (current_row > 0),
  started_at timestamptz not null default now(),
  last_worked_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id text not null,
  row_number integer,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patterns_owner_created_idx on public.patterns(owner_id, created_at desc);
create index if not exists projects_owner_status_idx on public.projects(owner_id, status, last_worked_at desc);
create index if not exists project_notes_project_row_idx on public.project_notes(project_id, row_number);

comment on table public.patterns is 'User-owned source patterns and private Blob references.';
comment on table public.pattern_rows is 'Reviewed row-by-row instructions extracted from a pattern.';
comment on table public.projects is 'A maker’s working instance of a pattern and resumable progress.';
comment on table public.project_notes is 'Project and row-specific maker notes.';
