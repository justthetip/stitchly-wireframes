alter table public.patterns add column if not exists page_count integer;
alter table public.patterns add column if not exists raw_text text;

create index if not exists pattern_rows_pattern_order_idx on public.pattern_rows(pattern_id, row_number);
