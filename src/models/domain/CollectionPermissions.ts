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

export class CollectionPermissions {
  constructor(public readonly read: boolean,
              public readonly write: boolean,
              public readonly create: boolean,
              public readonly remove: boolean,
              public readonly manage: boolean
  ) {
    Object.freeze(this);
  }

  public copy(modifications: {
    read?: boolean,
    write?: boolean,
    create?: boolean,
    remove?: boolean,
    manage?: boolean} = {}): CollectionPermissions {

    return new CollectionPermissions(
        getOrDefault(modifications.read, this.read),
        getOrDefault(modifications.write, this.write),
        getOrDefault(modifications.create, this.create),
        getOrDefault(modifications.remove, this.remove),
        getOrDefault(modifications.manage, this.manage)
    )
  }
}
