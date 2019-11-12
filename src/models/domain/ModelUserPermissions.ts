/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ModelPermissions} from "./ModelPermissions";
import {DomainUserId} from "./DomainUserId";
import {getOrDefault} from "../../utils/copy-utils";

export class ModelUserPermissions {
  constructor(
    public readonly userId: DomainUserId,
    public readonly permissions: ModelPermissions) {
    Object.freeze(this);
  }

  public copy(modifications: {userId?: DomainUserId, permissions?: ModelPermissions} = {}): ModelUserPermissions {
    return new ModelUserPermissions(
      getOrDefault(modifications.userId, this.userId),
      getOrDefault(modifications.permissions, this.permissions));
  }
}