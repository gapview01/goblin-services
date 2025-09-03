import { EventEmitter } from 'events';
import { createDriver, StakingDriver } from './driver';
import { createPositionsStore, PositionsStore } from './state/positions';
import { Position, PositionState } from './state/types';
import { scheduleSkim } from './timer-svc/schedule';
import { applyEvent, Event } from './stateMachine';
import { IntentStore, Intent } from './intent';
import config from './strategy';

interface DepositConfirmed {
  positionId: string;
  user: string;
  amount: number;
}

export class Orchestrator {
  private bus = new EventEmitter();
  private driver: StakingDriver;
  private positions: PositionsStore;
  private intents = new IntentStore();

  constructor(driver = createDriver(), positions = createPositionsStore()) {
    this.driver = driver;
    this.positions = positions;
    this.bus.on('poc.deposit.confirmed', (msg) => this.onDeposit(msg));
    this.bus.on('poc.skim.due', (msg) => this.onSkimDue(msg));
    this.bus.on('poc.unstake.claimable', (msg) => this.onClaim(msg));
  }

  getBus(): EventEmitter {
    return this.bus;
  }

  getPosition(id: string): Position | undefined {
    return this.positions.get(id);
  }

  private position(id: string, user: string, amount: number): Position {
    let pos = this.positions.get(id);
    if (!pos) {
      pos = { id, user, amount, state: PositionState.AWAITING_DEPOSIT, cycle: 0 };
      this.positions.upsert(pos);
    }
    return pos;
  }

  private intentKey(positionId: string, cycle: number, step: string): string {
    return `${positionId}:${cycle}:${step}`;
  }

  private recordIntent(key: string): Intent {
    const intent = this.intents.get(key) || { key, status: 'PENDING' };
    if (intent.status === 'CONFIRMED') return intent;
    intent.status = 'SUBMITTED';
    this.intents.set(intent);
    return intent;
  }

  private confirmIntent(key: string): void {
    const intent = this.intents.get(key);
    if (intent) {
      intent.status = 'CONFIRMED';
      this.intents.set(intent);
    }
  }

  private updateState(pos: Position, event: Event): void {
    const newState = applyEvent(pos.state, event);
    pos.state = newState;
    this.positions.upsert(pos);
  }

  private async onDeposit(msg: DepositConfirmed): Promise<void> {
    const pos = this.position(msg.positionId, msg.user, msg.amount);
    const key = this.intentKey(pos.id, pos.cycle, 'stake');
    this.recordIntent(key);
    await this.driver.stake(pos.amount, `stake:${pos.id}`);
    this.bus.emit('poc.stake.done', { positionId: pos.id });
    this.updateState(pos, 'poc.stake.done');
    scheduleSkim(this.bus, pos.id, config.skimPeriodDays);
    this.updateState(pos, 'skimScheduled');
    this.confirmIntent(key);
  }

  private async onSkimDue(msg: { positionId: string }): Promise<void> {
    const pos = this.positions.get(msg.positionId);
    if (!pos) return;
    const key = this.intentKey(pos.id, pos.cycle, 'unstake');
    if (this.intents.get(key)?.status === 'CONFIRMED') return;
    this.recordIntent(key);
    await this.driver.unstakeInstant(pos.amount, `unstake:${pos.id}`);
    this.bus.emit('poc.unstake.claimable', { positionId: pos.id, out: pos.amount + 1000 });
    this.updateState(pos, 'poc.skim.due');
    this.confirmIntent(key);
  }

  private async onClaim(msg: { positionId: string; out: number }): Promise<void> {
    const pos = this.positions.get(msg.positionId);
    if (!pos) return;
    const key = this.intentKey(pos.id, pos.cycle, 'claim');
    if (this.intents.get(key)?.status === 'CONFIRMED') return;
    this.recordIntent(key);
    const profit = this.driver.computeProfit(msg.out, pos.amount, 0);
    await this.driver.transferSol(pos.user, profit, `payout:${pos.id}`);
    this.bus.emit('poc.profit.paid', { positionId: pos.id, profit });
    this.updateState(pos, 'poc.unstake.claimable');
    this.updateState(pos, 'settled');
    this.confirmIntent(key);
    const restakeKey = this.intentKey(pos.id, pos.cycle + 1, 'restake');
    this.recordIntent(restakeKey);
    await this.driver.stake(pos.amount + profit, `restake:${pos.id}`);
    this.bus.emit('poc.restake.done', { positionId: pos.id });
    pos.cycle += 1;
    this.updateState(pos, 'poc.profit.paid');
    this.updateState(pos, 'poc.restake.done');
    this.confirmIntent(restakeKey);
  }
}
