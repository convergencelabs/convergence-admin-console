export class DomainMember {
  constructor(public readonly username: string,
              public readonly role: string) {
    Object.freeze(this);
  }
}