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

import {DomainId} from "../../models/DomainId";
import {DomainSessionData} from "./common-rest-data";
import {AbstractDomainService} from "./AbstractDomainService";
import {toDomainSession} from "./incoming-rest-data-converters";
import {DomainSession} from "../../models/domain/DomainSession";

export interface DomainSessionFilter {
  sessionId?: string;
  username?: string;
  remoteHost?: string;
  authMethod?: string;
  excludeDisconnected?: boolean;
  sessionType?: string;
}

export class DomainSessionService extends AbstractDomainService {

  public getSessions(
    domainId: DomainId,
    filter: DomainSessionFilter = {},
    offset: number = 0,
    limit: number = 20,): Promise<DomainSession[]> {

    const params = {limit, offset, ...filter};
    const url = this._getDomainUrl(domainId, "sessions");
    return this._get<DomainSessionData[]>(url, params)
      .then(sessions => sessions.map(toDomainSession));
  }
}

export const domainSessionService = new DomainSessionService();
