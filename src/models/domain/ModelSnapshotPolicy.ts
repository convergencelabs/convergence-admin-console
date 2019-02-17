export class ModelSnapshotPolicy {
  constructor(public readonly snapshotsEnabled: boolean,
              public readonly triggerByVersion: boolean,
              public readonly maximumVersionInterval: number,
              public readonly limitByVersion: boolean,
              public readonly minimumVersionInterval: number,
              public readonly triggerByTime: boolean,
              public readonly maximumTimeInterval: number,
              public readonly limitByTime: boolean,
              public readonly minimumTimeInterval: number) {
    Object.freeze(this);
  }
}
