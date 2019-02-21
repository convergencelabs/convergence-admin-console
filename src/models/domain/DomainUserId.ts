export enum DomainUserType {
  NORMAL = "normal",
  CONVERGENCE = "convergence",
  ANONYMOUS = "anonymous"
}

export class DomainUserId {
  constructor(public type: DomainUserType,
              public username: string) {
    Object.freeze(this);
  }
}
