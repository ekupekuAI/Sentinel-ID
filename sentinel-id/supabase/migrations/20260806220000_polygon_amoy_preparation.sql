alter table public.blockchain_logs add column polygon_transaction_hash text;
alter table public.blockchain_logs add column polygon_block_number bigint;
alter table public.blockchain_logs add column polygon_network text;
alter table public.blockchain_logs add column polygon_confirmations integer not null default 0 check (polygon_confirmations >= 0);
alter table public.blockchain_logs add column polygon_status text not null default 'NOT_SUBMITTED' check (polygon_status in ('NOT_SUBMITTED', 'PENDING', 'CONFIRMED', 'FAILED'));

create unique index blockchain_logs_polygon_transaction_hash_idx on public.blockchain_logs(polygon_transaction_hash) where polygon_transaction_hash is not null;
