export class DomainMember {
  constructor(public username: string,
              public role: string) {
    Object.freeze(this);
  }
}