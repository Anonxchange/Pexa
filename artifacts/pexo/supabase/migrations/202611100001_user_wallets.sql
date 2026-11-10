create table if not exists public.user_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_address text not null,
  chain_type text not null default 'evm',
  is_primary boolean not null default true,
  verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_wallet unique (user_id, wallet_address)
);

alter table public.user_wallets
  add column if not exists chain_type text not null default 'evm',
  add column if not exists is_primary boolean not null default true,
  add column if not exists verified_at timestamptz not null default now(),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists user_wallets_user_address_unique
  on public.user_wallets (user_id, wallet_address);

alter table public.user_wallets enable row level security;

drop policy if exists "Users can view their own wallets" on public.user_wallets;
create policy "Users can view their own wallets"
  on public.user_wallets for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert/update their own wallets" on public.user_wallets;
create policy "Users can insert/update their own wallets"
  on public.user_wallets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_user_wallet_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_wallets_updated_at on public.user_wallets;
create trigger user_wallets_updated_at
  before update on public.user_wallets
  for each row execute function public.set_user_wallet_updated_at();
