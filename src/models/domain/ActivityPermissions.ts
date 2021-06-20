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

import {getOrDefault} from "../../utils/copy-utils";
import {ActivityPermission} from "@convergence/convergence";
import {TypeChecker} from "../../utils/TypeChecker";

export class ActivityPermissions {
  public static NONE = new ActivityPermissions(false, false, false, false, false, false);

  public static of(permissions: Set<ActivityPermission> | ActivityPermission[]): ActivityPermissions {
    if (TypeChecker.isArray(permissions)) {
      permissions = new Set(permissions);
    }

    return new ActivityPermissions(
      permissions.has("join"),
      permissions.has("lurk"),
      permissions.has("view_state"),
      permissions.has("set_state"),
      permissions.has("remove"),
      permissions.has("manage")
    )
  }

  constructor(public readonly join: boolean,
              public readonly lurk: boolean,
              public readonly viewState: boolean,
              public readonly setState: boolean,
              public readonly remove: boolean,
              public readonly manage: boolean
  ) {
    Object.freeze(this);
  }

  public toPermissions(): Set<ActivityPermission> {
    const result = new Set<ActivityPermission>();
    if (this.join) result.add("join");
    if (this.lurk) result.add("lurk");
    if (this.viewState) result.add("view_state");
    if (this.setState) result.add("set_state");
    if (this.remove) result.add("remove");
    if (this.manage) result.add("manage");

    return result;
  }

  public copy(modifications: {
    join?: boolean,
    lurk?: boolean,
    viewState?: boolean,
    setState?: boolean,
    remove?: boolean,
    manage?: boolean
  } = {}): ActivityPermissions {
    return new ActivityPermissions(
      getOrDefault(modifications.join, this.join),
      getOrDefault(modifications.lurk, this.lurk),
      getOrDefault(modifications.viewState, this.viewState),
      getOrDefault(modifications.setState, this.setState),
      getOrDefault(modifications.remove, this.remove),
      getOrDefault(modifications.manage, this.manage),
    )
  }
}
