export interface StakingDriver {
  stake(amount: number, memo: string): Promise<string>;
  unstakeInstant(msolAmount: number, memo: string): Promise<string>;
  requestDelayedUnstake(msolAmount: number, memo: string): Promise<string>;
  claimDelayedUnstake(ticket: string, memo: string): Promise<string>;
  transferSol(to: string, amount: number, memo: string): Promise<void>;
  computeProfit(out: number, principal: number, fees: number): number;
}

class RealDriver implements StakingDriver {
  async stake(amount: number, memo: string): Promise<string> {
    console.log('stake', amount, memo);
    return 'stake-tx';
  }
  async unstakeInstant(msolAmount: number, memo: string): Promise<string> {
    console.log('unstakeInstant', msolAmount, memo);
    return 'unstake-tx';
  }
  async requestDelayedUnstake(msolAmount: number, memo: string): Promise<string> {
    console.log('requestDelayedUnstake', msolAmount, memo);
    return 'delay-ticket';
  }
  async claimDelayedUnstake(ticket: string, memo: string): Promise<string> {
    console.log('claimDelayedUnstake', ticket, memo);
    return 'claim-tx';
  }
  async transferSol(to: string, amount: number, memo: string): Promise<void> {
    console.log('transferSol', to, amount, memo);
  }
  computeProfit(out: number, principal: number, fees: number): number {
    return out - principal - fees;
  }
}

class DryRunDriver implements StakingDriver {
  async stake(amount: number, memo: string): Promise<string> {
    console.log('[dry-run] stake', amount, memo);
    return 'dry-stake';
  }
  async unstakeInstant(msolAmount: number, memo: string): Promise<string> {
    console.log('[dry-run] unstakeInstant', msolAmount, memo);
    return 'dry-unstake';
  }
  async requestDelayedUnstake(msolAmount: number, memo: string): Promise<string> {
    console.log('[dry-run] requestDelayedUnstake', msolAmount, memo);
    return 'dry-delay';
  }
  async claimDelayedUnstake(ticket: string, memo: string): Promise<string> {
    console.log('[dry-run] claimDelayedUnstake', ticket, memo);
    return 'dry-claim';
  }
  async transferSol(to: string, amount: number, memo: string): Promise<void> {
    console.log('[dry-run] transferSol', to, amount, memo);
  }
  computeProfit(out: number, principal: number, fees: number): number {
    return out - principal - fees;
  }
}

export function createDriver(): StakingDriver {
  if (process.env.DRY_RUN === 'true') {
    return new DryRunDriver();
  }
  return new RealDriver();
}
