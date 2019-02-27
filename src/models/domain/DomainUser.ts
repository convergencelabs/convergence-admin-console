export class DomainUser {
  constructor(public username: string,
              public displayName: string,
              public firstName: string,
              public lastName: string,
              public email: string,
              public disabled: boolean) {
    Object.freeze(this);
  }
}