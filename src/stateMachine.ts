import { PositionState } from './state/types';

export type Event =
  | 'poc.stake.done'
  | 'skimScheduled'
  | 'poc.skim.due'
  | 'poc.unstake.claimable'
  | 'settled'
  | 'poc.profit.paid'
  | 'poc.restake.done';

export function applyEvent(state: PositionState, event: Event): PositionState {
  switch (state) {
    case PositionState.AWAITING_DEPOSIT:
      if (event === 'poc.stake.done') return PositionState.STAKED;
      break;
    case PositionState.STAKED:
      if (event === 'skimScheduled') return PositionState.SKIM_SCHEDULED;
      if (event === 'poc.skim.due') return PositionState.UNSTAKING;
      break;
    case PositionState.SKIM_SCHEDULED:
      if (event === 'poc.skim.due') return PositionState.UNSTAKING;
      break;
    case PositionState.UNSTAKING:
      if (event === 'poc.unstake.claimable') return PositionState.CLAIMABLE;
      break;
    case PositionState.CLAIMABLE:
      if (event === 'settled') return PositionState.SETTLED;
      break;
    case PositionState.SETTLED:
      if (event === 'poc.profit.paid') return PositionState.PAY_PROFIT;
      break;
    case PositionState.PAY_PROFIT:
      if (event === 'poc.restake.done') return PositionState.RESTAKE;
      break;
  }
  return state;
}
