import {authStore} from '../stores/AuthStore';
import {AbstractService} from './AbstractService';
import {SuperAgentRequest} from "superagent";

export abstract class AbstractAuthenticatedService extends AbstractService {

  protected _processErrors(err: any) {
    if (err && err.response && err.response.status === 401) {
      authStore.logout();
    }
    return super._processErrors(err);
  };

  protected _preProcessRequest = (req: SuperAgentRequest) => {
    super._preProcessRequest(req);
    if (authStore.authToken) {
      req.set('authorization', `SessionToken ${authStore.authToken}`);
    }
  };
}
