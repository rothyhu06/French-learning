create extension if not exists pg_trgm;

alter type public.content_kind add value if not exists 'learning_objectives';
alter type public.content_kind add value if not exists 'notes';
alter type public.content_kind add value if not exists 'discovery';
alter type public.content_kind add value if not exists 'speaking';
alter type public.content_kind add value if not exists 'pronunciation';
alter type public.content_kind add value if not exists 'page_heading';

alter table public.chapters add column if not exists parent_id uuid references public.chapters(id) on delete cascade;
alter table public.chapters add column if not exists node_type text not null default 'unite';
alter table public.chapters add column if not exists title_fr text;
alter table public.chapters add column if not exists title_zh text;
alter table public.chapters add column if not exists source_order integer;
alter table public.chapters add column if not exists start_pdf_page_index integer;
alter table public.chapters add column if not exists end_pdf_page_index integer;
alter table public.chapters add column if not exists start_printed_page_number integer;
alter table public.chapters add column if not exists end_printed_page_number integer;
alter table public.chapters add constraint chapters_node_type_check check (node_type in ('front_matter','unite','savoir_faire','evaluation','annexes','subsection')) not valid;

alter table public.lessons add column if not exists lesson_kind text not null default 'lesson';
alter table public.lessons add column if not exists original_number text;
alter table public.lessons add column if not exists title_fr text;
alter table public.lessons add column if not exists title_zh text;
alter table public.lessons add column if not exists source_order integer;
alter table public.lessons add column if not exists start_pdf_page_index integer;
alter table public.lessons add column if not exists end_pdf_page_index integer;
alter table public.lessons add column if not exists start_printed_page_number integer;
alter table public.lessons add column if not exists end_printed_page_number integer;

create table if not exists public.textbook_pages (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  pdf_page_index integer not null check (pdf_page_index >= 0),
  pdf_page_number integer not null check (pdf_page_number >= 1),
  printed_page_number integer,
  page_type text not null check (page_type in ('front_matter','unit_cover','lesson','annex')),
  unit_id uuid references public.chapters(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  page_label text not null,
  is_duplicate boolean not null default false,
  duplicate_of_page_id uuid references public.textbook_pages(id) on delete set null,
  verification_status text not null default 'pending' check (verification_status in ('pending','pending_review','reviewed','verified','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (textbook_id, pdf_page_index),
  unique (textbook_id, pdf_page_number),
  check (pdf_page_number = pdf_page_index + 1),
  check (not is_duplicate or duplicate_of_page_id is not null)
);

create table if not exists public.source_blocks (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  textbook_page_id uuid not null references public.textbook_pages(id) on delete cascade,
  pdf_page_index integer not null,
  printed_page_number integer,
  source_bbox jsonb,
  block_type text not null,
  original_text text not null,
  language text not null check (language in ('fr','zh','mixed','und')),
  source_order integer not null,
  extraction_method text not null check (extraction_method in ('manual','pdf_text','vision','imported','ai_assisted')),
  verification_status text not null default 'pending' check (verification_status in ('pending','pending_review','reviewed','verified','rejected')),
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (textbook_id, source_order),
  check (source_bbox is null or (source_bbox ?& array['x','y','width','height']))
);

create table if not exists public.content_source_links (
  id uuid primary key default gen_random_uuid(),
  source_block_id uuid not null references public.source_blocks(id) on delete cascade,
  entity_type text not null check (entity_type in ('lesson','lesson_section','vocabulary','grammar','exercise','dialogue','expression','culture')),
  entity_id uuid not null,
  relation_type text not null default 'source' check (relation_type in ('source','context','example','translation')),
  confidence numeric(4,3) check (confidence between 0 and 1),
  verification_status text not null default 'pending' check (verification_status in ('pending','pending_review','reviewed','verified','rejected')),
  created_at timestamptz not null default now(),
  unique (source_block_id, entity_type, entity_id, relation_type)
);

create table if not exists public.textbook_search_index (
  id uuid primary key default gen_random_uuid(),
  source_block_id uuid not null unique references public.source_blocks(id) on delete cascade,
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  section_id uuid references public.lesson_sections(id) on delete cascade,
  original_text text not null,
  normalized_text text not null,
  accentless_text text not null,
  searchable_text text not null,
  language text not null check (language in ('fr','zh','mixed','und')),
  verification_status text not null default 'pending' check (verification_status in ('pending','pending_review','reviewed','verified','rejected')),
  updated_at timestamptz not null default now()
);

create index if not exists textbook_pages_printed_idx on public.textbook_pages(textbook_id, printed_page_number);
create index if not exists textbook_pages_lesson_idx on public.textbook_pages(lesson_id, pdf_page_index);
create index if not exists source_blocks_page_idx on public.source_blocks(textbook_page_id, source_order);
create index if not exists source_blocks_verified_idx on public.source_blocks(textbook_id, verification_status, block_type);
create index if not exists content_source_entity_idx on public.content_source_links(entity_type, entity_id);
create index if not exists textbook_search_normalized_trgm_idx on public.textbook_search_index using gin (normalized_text gin_trgm_ops);
create index if not exists textbook_search_accentless_trgm_idx on public.textbook_search_index using gin (accentless_text gin_trgm_ops);
create index if not exists textbook_search_mixed_trgm_idx on public.textbook_search_index using gin (searchable_text gin_trgm_ops);

alter table public.textbook_pages enable row level security;
alter table public.source_blocks enable row level security;
alter table public.content_source_links enable row level security;
alter table public.textbook_search_index enable row level security;

create policy "public read verified textbook pages" on public.textbook_pages for select using (verification_status = 'verified');
create policy "public read verified source blocks" on public.source_blocks for select using (verification_status = 'verified');
create policy "public read verified source links" on public.content_source_links for select using (verification_status = 'verified');
create policy "public read verified textbook search" on public.textbook_search_index for select using (verification_status = 'verified');

create policy "public read published textbooks" on public.textbooks for select using (import_status = 'published');
create policy "public read published chapters" on public.chapters for select using (true);
create policy "public read published lessons" on public.lessons for select using (published_at is not null);
create policy "public read published lesson sections" on public.lesson_sections for select using (true);
