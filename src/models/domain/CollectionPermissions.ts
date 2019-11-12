/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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
