#!/usr/bin/env bash
set -euo pipefail
# ─────────────────────────────────────────
# Sets passwords + confirms two EXISTING
# Auth users in the local Supabase stack.
#   • user@example.com  → user123
#   • admin@example.com → admin123 + role Admin
# Requires: curl, jq
# ─────────────────────────────────────────
SERVICE_ROLE="super-secret-jwt-token-with-at-least-32-characters-long"
BASE="http://localhost:54321/auth/v1/admin"
HDR=(-H "apikey: $SERVICE_ROLE" -H "Authorization: Bearer $SERVICE_ROLE" -H "Content-Type: application/json")

get_id () { # $1=email
  curl -sS "${HDR[@]:0:2}" "$BASE/users?email=$1" \
    | jq -r 'if type=="array" then (.[0].id // empty) else (.id // empty) end'
}

create_user () { # $1=email $2=password $3=role $4=phone
  local body
  body=$(jq -n --arg em "$1" --arg pw "$2" --arg role "$3" --arg ph "$4" '
    {
      email: $em,
      password: $pw,
      email_confirm: true
    }
    + ( ($role != "")  | if . then {app_metadata:{role:$role}} else {} end )
    + ( ($ph != "")    | if . then {phone:$ph, phone_confirm:true} else {} end )
  ')
  curl -sS -X POST "${HDR[@]}" "$BASE/users" -d "$body" | jq -r '.id // empty'
}

ensure_user () { # $1=email $2=password $3=role $4=phone
  echo "   → searching $1"
  local id
  id=$(get_id "$1")
  if [ -z "$id" ]; then
    echo "   → not found; will create"
    echo "▶ creating $1 …"
    id=$(create_user "$1" "$2" "$3" "$4")
    echo "   → created with ID $id"
  else
    echo "▶ updating $1 password …"
    echo "   → current ID $id"
    local patch
    patch=$(jq -n --arg pw "$2" --arg role "$3" --arg ph "$4" '
      {
        password: $pw,
        email_confirm: true
      }
      + ( ($role != "") | if . then {app_metadata:{role:$role}} else {} end )
      + ( ($ph != "")   | if . then {phone:$ph, phone_confirm:true} else {} end )
    ')
    curl -sS -X PATCH "${HDR[@]}" "$BASE/users/$id" -d "$patch" >/dev/null
  fi
  echo "   → finished for $1"
}

echo "▶ processing user@example.com and admin@example.com ..."

ensure_user "user@example.com"  "user123"  "" ""
ensure_user "admin@example.com" "admin123" "Admin" "999666999"

echo "✅  passwords set & accounts confirmed (user123 / admin123)"
