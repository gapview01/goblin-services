export enum PositionState {
  AWAITING_DEPOSIT = 'AWAITING_DEPOSIT',
  STAKED = 'STAKED',
  SKIM_SCHEDULED = 'SKIM_SCHEDULED',
  UNSTAKING = 'UNSTAKING',
  CLAIMABLE = 'CLAIMABLE',
  SETTLED = 'SETTLED',
  PAY_PROFIT = 'PAY_PROFIT',
  RESTAKE = 'RESTAKE'
}

export interface Position {
  id: string;
  user: string;
  amount: number;
  state: PositionState;
  cycle: number;
}
