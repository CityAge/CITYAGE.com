# Supabase Edge Functions Backup

This directory contains all edge functions deployed to the `urban-planet-brain` Supabase project (rniqmxpmtqmnwqtawlnz).

## Structure
```
supabase/functions/
  {function-name}/
    index.ts          # The edge function source code
```

## Backup Process
Each function is pulled from Supabase via the management API and stored here.
The FUNCTIONS_MANIFEST.md file tracks versions and backup status.

## Restore
To redeploy a function from this backup:
```bash
supabase functions deploy {function-name} --project-ref rniqmxpmtqmnwqtawlnz
```

## Important
- Never deploy from this backup without checking the live version first
- The manifest tracks which version was backed up
- Always update the manifest when deploying new versions
