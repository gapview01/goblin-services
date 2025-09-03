import { Orchestrator } from '../src/orchestrator';
import config from '../src/strategy';

jest.useFakeTimers();

describe('full cycle', () => {
  test('runs to restake', async () => {
    config.skimPeriodDays = 0;
    const orchestrator = new Orchestrator();
    const bus = orchestrator.getBus();
    bus.emit('poc.deposit.confirmed', { positionId: 'p1', user: 'alice', amount: 1000 });
    jest.runAllTimers();
    bus.emit('poc.skim.due', { positionId: 'p1' });
    bus.emit('poc.unstake.claimable', { positionId: 'p1', out: 1100 });
    await Promise.resolve();
    await Promise.resolve();
    const pos = orchestrator.getPosition('p1');
    expect(pos?.state).toBe('RESTAKE');
    jest.useRealTimers();
  });
});
