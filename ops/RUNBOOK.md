# Runbook (Pilot)

## Local (DEV)
1) Copy .env.example → .env (never commit real secrets)
2) Install deps (when code arrives)
3) Start services (when code arrives)

## Environments
- DEV: sandbox
- STAGE: rehearsal (promote manually)
- PROD: mainnet (not used during pilot)

## Rollback
- Revert to previous tag (e.g., pilot-v0.1.0) and redeploy to DEV.
