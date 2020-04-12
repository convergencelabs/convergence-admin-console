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

import {DomainUserId} from "./DomainUserId";

export class ChatInfo {
  constructor(public readonly chatId: string,
              public readonly type: string,
              public readonly membership: string,
              public readonly name: string,
              public readonly topic: string,
              public readonly members: DomainUserId[],
              public readonly created: Date,
              public readonly lastEventNumber: number,
              public readonly lastEventTimestamp: Date
  ) {
    Object.freeze(this);
  }
}
