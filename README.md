# Sentinel-ID

SentinelID is an identity-trust dashboard for security operations (SOC) analysts. For the signed-in identity it calculates a deterministic 0–100 **trust score** from device, behaviour, location, threat and history signals, returns an ALLOW / VERIFY / BLOCK recommendation, optionally explains it with Gemini, and records every analysis in a hash-chained **SecureChain** audit ledger.

The app lives in [`sentinel-id/`](sentinel-id). It's built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (Postgres, Auth, RLS), Zod and ethers/Hardhat for the optional Polygon Amoy contract.

## Features

- **Supabase auth.** Pages and API routes are protected, and `proxy.ts` refreshes the session and redirects signed-out users to `/login?next=…`.
- **Trust score engine** (`lib/trustScore/engine.ts`). It calculates a weighted score, a risk level, a decision, a confidence value and the risk factors.
- **AI explanation** (`services/geminiService.ts`). It uses Gemini when `GEMINI_API_KEY` is set and falls back to a deterministic explanation otherwise.
- **SecureChain ledger.** Each analysis is stored with a SHA-256 hash that includes the previous entry's hash (see `/ledger`).
- **Alerts, profile settings and a dashboard.** Their data is scoped per user by row-level security (RLS).
- **Polygon Amoy contract.** `contracts/SecureChainAudit.sol` comes with compile and deploy scripts. On-chain anchoring isn't wired into the app yet.

## Setup

```bash
cd sentinel-id
npm ci
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

1. Create a Supabase project and apply every SQL file in `sentinel-id/supabase/migrations/`, in order. You can use `supabase db push` or paste them into the SQL editor.
2. Create analyst users in Supabase → Authentication → Users. The app has no public sign-up.
3. Run `npm run lint` and `npm run build` to check the setup.

## Environment variables

| Variable | Required | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase → Project Settings → API (anon / publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes, **server-only** | Supabase → Project Settings → API (service_role / secret key). Needed to record analyses. |
| `GEMINI_API_KEY` | optional | https://aistudio.google.com/app/apikey |
| `GEMINI_MODEL` | optional | Defaults to `gemini-2.0-flash` |
| `RPC_URL`, `PRIVATE_KEY`, `CONTRACT_ADDRESS`, `POLYGON_AMOY_CHAIN_ID` | optional | Only for deploying the contract. Get an Amoy RPC from Alchemy and use a throwaway test wallet. |

If a key is missing, the app shows a clear message instead of crashing: the login page warns that Supabase isn't configured, and the dashboard names the missing `SUPABASE_SERVICE_ROLE_KEY`.

## What changed in this version

These are fix-only changes. The UI and feature set are the same as before.

| Before | After |
| --- | --- |
| **Security:** any signed-in user could call the `record_identity_analysis` RPC from the browser with the public key and record a forged 100 / ALLOW trust score and ledger entry for themselves. | EXECUTE is revoked from `public`, `anon` and `authenticated` (migration `20261014000000_harden_analysis_writes.sql`). Only the server, using the service role after verifying the session, can record analyses. |
| **Security:** the profile UPDATE policy let users rewrite any column of their `users` row, including `email`. | Users can only update `full_name`, `job_title` and `department` (column-level grant). |
| Every dashboard load re-upserted the profile and **reset the name** you had edited in Settings. | The profile row is only back-filled when it's missing, never overwritten. |
| `?next=` was ignored after login, so you always landed on `/dashboard`. | You return to the page you asked for. The value is validated as a same-origin path, so it can't be used as an open redirect. |
| The login page gave no hint when Supabase wasn't configured. | It shows a clear configuration message. |
| A profile validation error returned a raw JSON dump of Zod issues. | The first readable message is returned. |
| Timestamps were formatted on the server, in the server's locale and time zone. | The API returns ISO strings, which the browser formats locally. |
| Settings → Cancel did nothing. | Cancel restores the last saved values. |
| "Total Alerts (24h)" counted all alerts. | The tile is labelled "Total Alerts". |
| `package-lock.json` was out of sync, so `npm ci` failed. | The lockfile is in sync. |
