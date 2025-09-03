import { EventEmitter } from 'events';

export function scheduleSkim(
  bus: EventEmitter,
  positionId: string,
  periodDays: number
): NodeJS.Timeout {
  const ms = periodDays * 24 * 60 * 60 * 1000;
  return setTimeout(() => {
    bus.emit('poc.skim.due', { positionId });
  }, ms);
}
