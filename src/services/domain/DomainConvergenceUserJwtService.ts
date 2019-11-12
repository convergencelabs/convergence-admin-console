/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
