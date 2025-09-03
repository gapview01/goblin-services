import { applyEvent } from '../src/stateMachine';
import { PositionState } from '../src/state/types';

describe('state machine', () => {
  test('valid transitions', () => {
    let state = PositionState.AWAITING_DEPOSIT;
    state = applyEvent(state, 'poc.stake.done');
    expect(state).toBe(PositionState.STAKED);
    state = applyEvent(state, 'skimScheduled');
    expect(state).toBe(PositionState.SKIM_SCHEDULED);
    state = applyEvent(state, 'poc.skim.due');
    expect(state).toBe(PositionState.UNSTAKING);
  });

  test('idempotent', () => {
    let state = PositionState.STAKED;
    state = applyEvent(state, 'poc.stake.done');
    expect(state).toBe(PositionState.STAKED);
  });
});
