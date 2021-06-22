/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import {getOrDefault} from "../../../utils/copy-utils";
import {ActivityPermissions} from "./ActivityPermissions";
import {DomainUserId} from "@convergence/convergence";

export class ActivityUserPermissions {
  constructor(
    public readonly userId: DomainUserId,
    public readonly permissions: ActivityPermissions) {
    Object.freeze(this);
  }

  public copy(modifications: {userId?: DomainUserId, permissions?: ActivityPermissions} = {}): ActivityUserPermissions {
    return new ActivityUserPermissions(
      getOrDefault(modifications.userId, this.userId),
      getOrDefault(modifications.permissions, this.permissions));
  }
}