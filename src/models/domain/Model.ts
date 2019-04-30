export class Model {
  constructor(public readonly id: string,
              public readonly collection: string,
              public readonly version: number,
              public readonly created: Date,
              public readonly modified: Date,
              public readonly data?: {[key: string]: any}
  ) {
    Object.freeze(this);
  }
}
