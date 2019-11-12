/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {getOrDefault} from "../../utils/copy-utils";

export class ModelPermissions {
  constructor(
    public readonly read: boolean,
    public readonly write: boolean,
    public readonly remove: boolean,
    public readonly manage: boolean) {
    Object.freeze(this);
  }

  public copy(modifications: {
    read?: boolean,
    write?: boolean,
    remove?: boolean,
    manage?: boolean} = {}): ModelPermissions {

    return new ModelPermissions(
      getOrDefault(modifications.read, this.read),
      getOrDefault(modifications.write, this.write),
      getOrDefault(modifications.remove, this.remove),
      getOrDefault(modifications.manage, this.manage)
    )
  }
}

