export type IntentStatus = 'PENDING' | 'SUBMITTED' | 'CONFIRMED';

export interface Intent {
  key: string; // positionId:cycle:step
  status: IntentStatus;
}

export class IntentStore {
  private store = new Map<string, Intent>();

  get(key: string): Intent | undefined {
    return this.store.get(key);
  }

  set(intent: Intent): void {
    this.store.set(intent.key, intent);
  }
}
