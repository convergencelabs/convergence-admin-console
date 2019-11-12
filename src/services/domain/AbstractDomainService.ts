/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {AbstractAuthenticatedService} from "../AbstractAuthenticatedService";
import {DomainId} from "../../models/DomainId";

export class AbstractDomainService extends AbstractAuthenticatedService {
  protected _getDomainUrl(domain: DomainId, relPath: string): string {
    return `domains/${domain.namespace}/${domain.id}/${relPath}`;
  }
}