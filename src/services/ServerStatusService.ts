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

import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {ServerStatusData} from "./domain/rest-data";
import {ServerStatus} from "../models/ServerStatus";


export class ServerStatusService extends AbstractAuthenticatedService {
  public getStatus(): Promise<ServerStatus> {
    return this
      ._get<ServerStatusData>("status")
      .then(status => new ServerStatus(
        status.version,
        status.distribution,
        status.status,
        status.namespaces,
        status.domains
      ));
  }
}

export const serverStatusService = new ServerStatusService();
