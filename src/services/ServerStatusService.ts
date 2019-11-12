/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
