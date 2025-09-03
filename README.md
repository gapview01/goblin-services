# Goblin Services — API • Indexer • Timekeeper
[![CI](https://github.com/goblin-sh/goblin-services/actions/workflows/poc-staking-orchestrator-v1.yml/badge.svg?branch=poc/staking-orchestrator-v1)](https://github.com/goblin-sh/goblin-services/actions/workflows/poc-staking-orchestrator-v1.yml)
Off-chain smarts that connect the wallet and bots to on-chain programs.

Day-1: minimal pilot (DEV only) to exercise basic flows.

- **API**: endpoints for wallet/console
- **Indexer**: reads chain → local state
- **Timekeeper**: schedules payouts/dividend policies

**Bucket:** Off-Chain Smarts (platform-agnostic)
**Status:** PILOT (DEV)

- Overview → /docs/OVERVIEW.md
- Runbook → /ops/RUNBOOK.md

## Staking Orchestrator POC

This proof-of-concept adds a minimal staking orchestrator.

### Run

```
npm install
npm run build
node dist/orchestrator-svc/index.js
```

### Env Vars

See [.env.example](.env.example). `DRY_RUN=true` will log driver calls without executing them.
