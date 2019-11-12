/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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
