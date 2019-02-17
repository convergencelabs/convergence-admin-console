export class CollectionSummary {
  constructor(public readonly id: string,
              public readonly description: string,
              public readonly modelCount: number) {
    Object.freeze(this);
  }
}
