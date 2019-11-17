/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import {ModelPermissions} from "./ModelPermissions";
import {ModelUserPermissions} from "./ModelUserPermissions";
import {getOrDefault} from "../../utils/copy-utils";

export class ModelPermissionSummary {
  constructor(
    public readonly overrideWorld: boolean,
    public readonly worldPermissions: ModelPermissions,
    public readonly userPermissions: ModelUserPermissions[]) {
    Object.freeze(this);
  }

  public copy(modifications: {
    overrideWorld?: boolean,
    worldPermissions?: ModelPermissions,
    userPermissions?: ModelUserPermissions[]
  } = {}) {
    return new ModelPermissionSummary(
      getOrDefault(modifications.overrideWorld, this.overrideWorld),
      getOrDefault(modifications.worldPermissions, this.worldPermissions),
      getOrDefault(modifications.userPermissions, this.userPermissions)
    );
  }
}