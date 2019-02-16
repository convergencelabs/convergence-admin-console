export class DomainId {
  constructor(public readonly namespace: string,
              public readonly id: string) {
    Object.freeze(this);
  }

  public equals(other: DomainId): boolean {
    if (!other) {
      return false;
    } else if (!(other instanceof DomainId)) {
      return false;
    } else if (this === other) {
      return true;
    } else {
      return this.namespace === other.namespace && this.id === other.id;
    }
  }
}
