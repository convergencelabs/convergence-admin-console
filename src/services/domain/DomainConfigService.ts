import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ModelSnapshotPolicyData} from "./common-rest-data";
import {toModelSnapshotPolicy} from "./incoming-rest-data-converters";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {toModelSnapshotPolicyData} from "./outgoing-rest-data-converters";

export class DomainConfigService extends AbstractDomainService {

  public getAnonymousAuthEnabled(domainId: DomainId): Promise<boolean> {
    const url = this._getDomainUrl(domainId,`config/anonymousAuth`);
    return this._get<{enabled: boolean}>(url).then(resp => resp.enabled);
  }

  public setAnonymousAuthEnabled(domainId: DomainId, enabled: boolean): Promise<void> {
    const body = {
      enabled
    };
    const url = this._getDomainUrl(domainId,`config/anonymousAuth`);
    return this._put<void>(url, body);
  }

  public getModelSnapshotPolicy(domainId: DomainId): Promise<ModelSnapshotPolicy> {
    const url = this._getDomainUrl(domainId,`config/modelSnapshotPolicy`);
    return this._get<ModelSnapshotPolicyData>(url)
      .then(toModelSnapshotPolicy);
  }

  public setModelSnapshotPolicy(domainId: DomainId, policy: ModelSnapshotPolicy): Promise<void> {
    const url = this._getDomainUrl(domainId,`config/modelSnapshotPolicy`);
    const data = toModelSnapshotPolicyData(policy);
    return this._put<void>(url, data);
  }
}

export const domainConfigService = new DomainConfigService();
