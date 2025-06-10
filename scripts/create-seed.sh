#!/usr/bin/env bash
set -euo pipefail

# ───────────────────────────────────────────────
# Creates a single SQL file (supabase/seed/seed.sql)
#   • pulls current tags from the public REST endpoint
#   • writes a COPY block for tags
#   • appends two demo users (normal + Admin) to profiles
# Requirements: curl, jq
# ───────────────────────────────────────────────

command -v jq   >/dev/null || { echo "❌  jq missing";   exit 1; }
command -v curl >/dev/null || { echo "❌  curl missing"; exit 1; }

mkdir -p supabase/seed

API_URL="https://aqdbdmepncxxuanlymwr.supabase.co/rest/v1/tags?select=*"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJkbWVwbmN4eHVhbmx5bXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTA0MjYsImV4cCI6MjA2MDYyNjQyNn0.RNtZZ4Of4LIP3XuS9lumHYdjRLVUGXARtAxaTJmF7lc"

tmp_json=$(mktemp)
seed_file="supabase/seed/seed.sql"

echo "▶ downloading tags…"
curl -sSL "$API_URL" \
     -H "apikey: $API_KEY" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Accept: application/json" > "$tmp_json"

echo "▶ building seed.sql…"
{
  echo "-- Auto‑generated seed file"
  echo "SET client_encoding = 'UTF8';"
  echo ""
  echo "COPY tags (id,name,color,icon) FROM STDIN CSV;"
  jq -r '.[] | [.id, .name, .color, .icon] | @csv' "$tmp_json"
  echo "\."
  echo ""
  echo "-- Demo auth.users rows"
  echo "INSERT INTO auth.users (id, email, raw_app_meta_data)"
  echo "VALUES"
  echo "  ('00000000-0000-4000-8000-000000000001', 'user@example.com', '{\"provider\":\"email\",\"providers\":[\"email\"]}'),"
  echo "  ('00000000-0000-4000-8000-000000000002', 'admin@example.com', '{\"role\":\"Admin\",\"provider\":\"email\",\"providers\":[\"email\"]}');"
} > "$seed_file"

rm -f "$tmp_json"

echo "✅  Wrote $seed_file"

