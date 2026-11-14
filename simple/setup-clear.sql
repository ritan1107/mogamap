-- もぐマップ シンプル版：「スタンプ3つで1クリア」記録用
-- Supabase の SQL Editor に全部貼り付けて「Run」を1回押すだけ。何度実行しても大丈夫です。
-- 既存のテーブルや関数は変更しません（新しいテーブル1つと関数3つを足すだけ）。

create table if not exists public.mogu_clear_events (
  id            uuid primary key default gen_random_uuid(),
  participant_id text not null,
  nickname      text,
  entry_id      text,
  clear_no      int  not null,
  stamp_count   int,
  created_at    timestamptz not null default now(),
  reward_given  boolean not null default false,
  given_at      timestamptz,
  unique (participant_id, clear_no)
);
alter table public.mogu_clear_events enable row level security;  -- 直接は読めない。下の関数経由のみ
revoke all on public.mogu_clear_events from anon, authenticated;

-- 参加者：自分のスタンプ数を確認して、3つごとのクリアを記録。自分のクリア一覧を返す
create or replace function public.mogu_record_clears(p_participant_id text, p_participant_token text, p_per_clear int default 3)
returns table (clear_no int, created_at timestamptz, reward_given boolean, given_at timestamptz, stamp_count int)
language plpgsql security definer set search_path = public as $$
declare
  v_count int; v_nick text; v_entry text; v_per int := greatest(coalesce(p_per_clear,3),1); i int;
begin
  -- 既存の get_rally_progress で本人確認＋スタンプ数を取得（IDやトークンが違えば取れない）
  execute format('select stamp_count::int, nickname::text from public.get_rally_progress(%L, %L) limit 1', p_participant_id, p_participant_token)
    into v_count, v_nick;
  if v_count is null then raise exception '参加情報を確認できません'; end if;
  begin
    execute format('select participant_entry_id::text from public.get_participant_entry_id(%L, %L) limit 1', p_participant_id, p_participant_token) into v_entry;
  exception when others then v_entry := null;
  end;
  for i in 1 .. (v_count / v_per) loop
    insert into public.mogu_clear_events (participant_id, nickname, entry_id, clear_no, stamp_count)
    values (p_participant_id, v_nick, v_entry, i, v_count)
    on conflict on constraint mogu_clear_events_participant_id_clear_no_key do nothing;
  end loop;
  update public.mogu_clear_events e set nickname = v_nick, entry_id = coalesce(v_entry, e.entry_id)
   where e.participant_id = p_participant_id and (e.nickname is distinct from v_nick);
  return query
    select e.clear_no, e.created_at, e.reward_given, e.given_at, v_count
      from public.mogu_clear_events e where e.participant_id = p_participant_id order by e.clear_no;
end $$;

-- 主催者：クリア一覧（管理者PINは既存の list_shops_by_admin_pin で確認）
create or replace function public.mogu_list_clears_admin(p_admin_pin text)
returns table (id uuid, nickname text, entry_id text, clear_no int, stamp_count int, created_at timestamptz, reward_given boolean, given_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  execute format('select 1 from public.list_shops_by_admin_pin(%L) limit 1', p_admin_pin);  -- PINが違えばここでエラー
  return query select e.id, e.nickname, e.entry_id, e.clear_no, e.stamp_count, e.created_at, e.reward_given, e.given_at
    from public.mogu_clear_events e order by e.reward_given, e.created_at desc;
end $$;

-- 主催者：景品を渡した／取り消し
create or replace function public.mogu_set_reward_given(p_admin_pin text, p_event_id uuid, p_given boolean)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  execute format('select 1 from public.list_shops_by_admin_pin(%L) limit 1', p_admin_pin);
  update public.mogu_clear_events set reward_given = p_given, given_at = case when p_given then now() else null end where id = p_event_id;
  return found;
end $$;

grant execute on function public.mogu_record_clears(text, text, int) to anon, authenticated;
grant execute on function public.mogu_list_clears_admin(text) to anon, authenticated;
grant execute on function public.mogu_set_reward_given(text, uuid, boolean) to anon, authenticated;
notify pgrst, 'reload schema';
