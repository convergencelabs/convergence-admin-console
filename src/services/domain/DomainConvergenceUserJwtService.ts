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
import {AbstractDomainService} from "./AbstractDomainService";

export class DomainConvergenceUserJwtService extends AbstractDomainService {

  public getJwt(domain: DomainId): Promise<string> {
    const url = this._getDomainUrl(domain, `convergenceUserToken`);
    return this
      ._get<{token: string}>(url)
      .then(resp => resp.token);
  }
}

export const domainConvergenceJwtService = new DomainConvergenceUserJwtService();
