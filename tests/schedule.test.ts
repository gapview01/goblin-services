import { EventEmitter } from 'events';
import { scheduleSkim } from '../src/timer-svc/schedule';

jest.useFakeTimers();

describe('schedule', () => {
  test('emits skim due', () => {
    const bus = new EventEmitter();
    const handler = jest.fn();
    bus.on('poc.skim.due', handler);
    scheduleSkim(bus, 'pos1', 0.000001);
    jest.runAllTimers();
    expect(handler).toHaveBeenCalledWith({ positionId: 'pos1' });
  });
});
