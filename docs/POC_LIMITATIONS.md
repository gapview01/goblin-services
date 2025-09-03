# POC Limitations

- Staking driver is fully mocked and does not touch the blockchain.
- Timers use `setTimeout` instead of Cloud Tasks.
- State is kept in memory; restarting the process loses progress.
- No authentication or security is implemented.
