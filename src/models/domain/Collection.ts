import {ModelSnapshotPolicy} from "./ModelSnapshotPolicy";
import {CollectionPermissions} from "./CollectionPermissions";

export class Collection {
  constructor(public readonly id: string,
              public readonly description: string,
              public readonly worldPermissions: CollectionPermissions,
              public readonly overrideSnapshotPolicy: boolean,
              public readonly snapshotPolicy: ModelSnapshotPolicy
  ) {
    Object.freeze(this);
  }
}
