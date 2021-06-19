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

export class ActivityPermissions {
  constructor(public readonly join: boolean,
              public readonly lurk: boolean,
              public readonly viewState: boolean,
              public readonly setState: boolean,
              public readonly remove: boolean,
              public readonly manage: boolean
  ) {
    Object.freeze(this);
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
