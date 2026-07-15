create extension if not exists "pgcrypto";

create type public.lesson_status as enum ('locked', 'available', 'in_progress', 'completed');
create type public.content_kind as enum ('dialogue', 'vocabulary', 'expression', 'grammar', 'example', 'listening', 'exercise', 'culture');
create type public.exercise_kind as enum ('choice', 'fill_blank', 'translation', 'listening', 'speaking', 'writing');
create type public.review_rating as enum ('again', 'hard', 'good', 'easy');
create type public.import_status as enum ('uploaded', 'processing', 'needs_review', 'published', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  current_level text not null default 'A1',
  daily_goal_minutes integer not null default 30 check (daily_goal_minutes between 5 and 240),
  timezone text not null default 'Asia/Shanghai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.textbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  edition text,
  source_type text not null default 'pdf' check (source_type in ('pdf','scanned_pdf','epub','docx')),
  source_file_name text,
  page_count integer,
  import_status public.import_status not null default 'uploaded',
  checksum text,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  title text not null,
  level text not null,
  position integer not null,
  source_page_start integer,
  source_page_end integer,
  created_at timestamptz not null default now(),
  unique (textbook_id, position)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  slug text not null unique,
  number integer not null,
  title text not null,
  subtitle text,
  objectives text[] not null default '{}',
  estimated_minutes integer not null default 45,
  source_page_start integer,
  source_page_end integer,
  source_revision integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, number)
);

create table public.lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  kind public.content_kind not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  position integer not null,
  estimated_minutes integer not null default 5,
  source_page_start integer,
  source_page_end integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, position)
);

create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_id uuid references public.lesson_sections(id) on delete set null,
  french text not null,
  chinese text not null,
  part_of_speech text,
  gender text check (gender in ('m.', 'f.', 'm./f.')),
  plural text,
  ipa text,
  audio_url text,
  source_page integer,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.vocabulary_examples (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  french text not null,
  chinese text,
  source_page integer,
  position integer not null default 0
);

create table public.grammar_points (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_id uuid references public.lesson_sections(id) on delete set null,
  title text not null,
  explanation jsonb not null default '{}'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  source_page integer,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_id uuid references public.lesson_sections(id) on delete set null,
  kind public.exercise_kind not null,
  prompt jsonb not null,
  answer jsonb not null,
  explanation jsonb not null default '{}'::jsonb,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  source_page integer,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.lesson_status not null default 'available',
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  active_seconds integer not null default 0,
  last_section_id uuid references public.lesson_sections(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  mastery smallint not null default 0 check (mastery between 0 and 5),
  is_favorite boolean not null default false,
  review_count integer not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table public.review_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid references public.vocabulary(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  rating public.review_rating not null,
  response_ms integer,
  reviewed_at timestamptz not null default now(),
  check ((vocabulary_id is not null)::int + (exercise_id is not null)::int = 1)
);

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_answer jsonb not null,
  error_count integer not null default 1,
  first_error_at timestamptz not null default now(),
  last_error_at timestamptz not null default now(),
  remastered_at timestamptz,
  unique (user_id, exercise_id)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  session_date date not null default current_date,
  active_seconds integer not null default 0,
  points integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  tasks jsonb not null default '[]'::jsonb,
  target_minutes integer not null default 30,
  completed_minutes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_date)
);

create table public.conversation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  teacher_role text not null check (teacher_role in ('grammar','speaking','writing','translation','exam')),
  messages jsonb not null default '[]'::jsonb,
  lesson_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.textbook_imports (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  status public.import_status not null default 'uploaded',
  parser_version text not null,
  source_checksum text not null,
  extraction_summary jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index lessons_chapter_idx on public.lessons(chapter_id, number);
create index vocabulary_lesson_idx on public.vocabulary(lesson_id, position);
create index vocab_review_due_idx on public.vocabulary_progress(user_id, next_review_at);
create index mistakes_user_active_idx on public.mistakes(user_id, remastered_at, last_error_at desc);
create index study_sessions_user_date_idx on public.study_sessions(user_id, session_date desc);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.review_logs enable row level security;
alter table public.mistakes enable row level security;
alter table public.study_sessions enable row level security;
alter table public.daily_plans enable row level security;
alter table public.conversation_history enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own lesson progress" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own vocabulary progress" on public.vocabulary_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own review logs" on public.review_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own mistakes" on public.mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own study sessions" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own daily plans" on public.daily_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own conversations" on public.conversation_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.textbooks enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.vocabulary enable row level security;
alter table public.vocabulary_examples enable row level security;
alter table public.grammar_points enable row level security;
alter table public.exercises enable row level security;

create policy "authenticated read textbooks" on public.textbooks for select to authenticated using (true);
create policy "authenticated read chapters" on public.chapters for select to authenticated using (true);
create policy "authenticated read lessons" on public.lessons for select to authenticated using (true);
create policy "authenticated read sections" on public.lesson_sections for select to authenticated using (true);
create policy "authenticated read vocabulary" on public.vocabulary for select to authenticated using (true);
create policy "authenticated read examples" on public.vocabulary_examples for select to authenticated using (true);
create policy "authenticated read grammar" on public.grammar_points for select to authenticated using (true);
create policy "authenticated read exercises" on public.exercises for select to authenticated using (true);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
