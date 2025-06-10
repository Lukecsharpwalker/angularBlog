# Supabase Password Script Fix

## Issue Description
When running the `npm run users:passwords` command, the following error occurred:
```
▶ fetching user IDs…
jq: error (at <stdin>:0): Cannot index object with number
```

## Cause of the Issue
The error occurred in the `get_id` function of the `scripts/set-passwords.sh` script. The function was using jq to extract the user ID from the JSON response with the command:
```bash
jq -r '.[0].id // empty'
```

This command assumes that the response from the Supabase Auth API is an array, and it tries to access the first element (`.[0]`). However, the error message "Cannot index object with number" indicates that the response is actually an object, not an array, so the `.[0]` indexing fails.

## Solution
The solution is to modify the jq command to handle both cases: if the response is an array, it will use the original approach; if it's an object, it will try to access the `id` property directly.

### Changes to set-passwords.sh
```bash
# Before:
get_id () {  # $1=email
  curl -sS "${HDR[@]:0:2}" "$BASE/users?email=$1" | jq -r '.[0].id // empty'
}

# After:
get_id () {  # $1=email
  curl -sS "${HDR[@]:0:2}" "$BASE/users?email=$1" | jq -r 'if type == "array" then .[0].id // empty else .id // empty end'
}
```

The new jq command uses the `type` function to check if the response is an array. If it is, it accesses the first element's id property as before. If it's an object, it tries to access the id property directly. This makes the script more robust and able to handle different response formats from the Supabase Auth API.

## How to Test
To test this fix:
1. Make sure your local Supabase instance is running
2. Run the script: `npm run users:passwords`
3. Verify that it successfully sets the passwords for the two users without any errors
