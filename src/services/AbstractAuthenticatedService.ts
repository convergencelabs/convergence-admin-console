import { AuthStore } from '../stores/AuthStore';
import { AbstractService } from './AbstractService';

export abstract class AbstractAuthenticatedService extends AbstractService {

  private readonly _authStore: AuthStore | undefined;

  protected constructor(baseUrl: string, authStore: AuthStore) {
    super(baseUrl);
    this._authStore = authStore;
  }

  protected _processErrors(err: any) {
    if (err && err.response && err.response.status === 401) {
      if (this._authStore) {
        // this._authStore.logout();
      }
    }
    return super._processErrors(err);
  };
}
