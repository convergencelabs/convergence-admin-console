export class CollectionPermissions {
  constructor(public readonly read: boolean,
              public readonly write: boolean,
              public readonly create: boolean,
              public readonly remove: boolean,
              public readonly manage: boolean
  ) {
    Object.freeze(this);
  }
}
