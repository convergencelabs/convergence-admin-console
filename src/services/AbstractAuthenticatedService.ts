/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {authStore} from '../stores/AuthStore';
import {AbstractService} from './AbstractService';
import {Response, SuperAgentRequest} from "superagent";

export abstract class AbstractAuthenticatedService extends AbstractService {

  protected _processResponse(httpResponse: Response) {
    if (httpResponse.status === 401) {
      authStore.logout();
    }
    return super._processResponse(httpResponse);
  };

  protected _preProcessRequest = (req: SuperAgentRequest) => {
    super._preProcessRequest(req);
    if (authStore.authToken) {
      req.set('authorization', `SessionToken ${authStore.authToken}`);
    }
  };
}
