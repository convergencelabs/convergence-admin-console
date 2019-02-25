export class DomainStatistics {
  constructor(public readonly activeSessionCount: number,
              public readonly userCount: number,
              public readonly modelCount: number,
              public readonly dbSize: number) {
    Object.freeze(this);
  }
}