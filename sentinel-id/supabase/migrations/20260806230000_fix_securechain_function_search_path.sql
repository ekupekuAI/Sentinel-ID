-- Supabase commonly installs pgcrypto in the extensions schema. The original
-- security-definer functions used an empty search path, which can prevent
-- digest() from resolving during an authenticated identity analysis.
alter function public.append_securechain_entry(uuid, uuid, smallint, text, text)
  set search_path = pg_catalog, public, extensions;

alter function public.record_identity_analysis(uuid, smallint, text, text, numeric, jsonb, jsonb, text, text, text, text)
  set search_path = pg_catalog, public, extensions;
