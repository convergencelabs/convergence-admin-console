export class DomainJwtKey {
  constructor(public id: string,
              public description: string,
              public updated: Date,
              public key: string,
              public enabled: boolean) {
    Object.freeze(this);
  }
}
