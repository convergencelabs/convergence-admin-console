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

export class DomainId {
  constructor(public readonly namespace: string,
              public readonly id: string) {
    Object.freeze(this);
  }

  public equals(other: DomainId): boolean {
    if (!other) {
      return false;
    } else if (!(other instanceof DomainId)) {
      return false;
    } else if (this === other) {
      return true;
    } else {
      return this.namespace === other.namespace && this.id === other.id;
    }
  }
}
