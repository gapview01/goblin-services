# State Machine

```
AWAITING_DEPOSIT -> STAKED -> SKIM_SCHEDULED -> UNSTAKING -> CLAIMABLE -> SETTLED -> PAY_PROFIT -> RESTAKE
```

Each transition only occurs on the events defined in [TOPICS.md](TOPICS.md).
Replaying an event that has already been applied leaves the state unchanged.
