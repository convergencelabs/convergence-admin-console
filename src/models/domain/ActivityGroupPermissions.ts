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

import {getOrDefault} from "../../utils/copy-utils";
import {ActivityPermissions} from "./ActivityPermissions";

export class ActivityGroupPermissions {
  constructor(
    public readonly groupId: string,
    public readonly permissions: ActivityPermissions) {
    Object.freeze(this);
  }

  public copy(modifications: {groupId?: string, permissions?: ActivityPermissions} = {}): ActivityGroupPermissions {
    return new ActivityGroupPermissions(
      getOrDefault(modifications.groupId, this.groupId),
      getOrDefault(modifications.permissions, this.permissions));
  }
}
