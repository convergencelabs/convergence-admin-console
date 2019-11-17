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
