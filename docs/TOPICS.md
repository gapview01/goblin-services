# POC Pub/Sub Topics

All topics are prefixed with `poc.` for the proof-of-concept.
Each message carries an `idempotencyKey` to allow safe retries.

| Topic | Payload | Idempotency Key |
|-------|---------|-----------------|
| `poc.stake.ordered` | `{ positionId, amount }` | `positionId:cycle:stake` |
| `poc.deposit.confirmed` | `{ positionId, user, amount }` | `positionId:cycle:deposit` |
| `poc.stake.done` | `{ positionId }` | `positionId:cycle:stake` |
| `poc.skim.due` | `{ positionId }` | `positionId:cycle:skim` |
| `poc.unstake.requested` | `{ positionId }` | `positionId:cycle:unstake` |
| `poc.unstake.claimable` | `{ positionId, out }` | `positionId:cycle:claim` |
| `poc.profit.paid` | `{ positionId, profit }` | `positionId:cycle:payout` |
| `poc.restake.done` | `{ positionId }` | `positionId:cycle:restake` |
| `poc.error` | `{ positionId, step, message }` | N/A |
