# Overview
Goblin Services run the off-chain logic:
- API: simple REST surface for pilots
- Indexer: subscribe to program events
- Timekeeper: trigger scheduled actions

Scope (Day-1):
- DEV environment only
- Fake/stubbed behaviour where needed
- No secrets in repo (use Secret Manager via CI)
