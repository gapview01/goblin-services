import { Position } from './types';

export interface PositionsStore {
  get(id: string): Position | undefined;
  upsert(position: Position): void;
}

export class InMemoryPositions implements PositionsStore {
  private store = new Map<string, Position>();

  get(id: string): Position | undefined {
    return this.store.get(id);
  }

  upsert(position: Position): void {
    this.store.set(position.id, position);
  }
}

export function createPositionsStore(): PositionsStore {
  return new InMemoryPositions();
}
