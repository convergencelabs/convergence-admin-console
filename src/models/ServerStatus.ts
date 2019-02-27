export class ServerStatus {
  constructor(public readonly version: string,
              public readonly distribution: string,
              public readonly status: string,
              public readonly namespaces: number,
              public readonly domains: number
  ) {
    Object.freeze(this);
  }
}
