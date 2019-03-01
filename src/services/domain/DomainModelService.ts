import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ModelData, ModelPermissionSummaryData} from "./common-rest-data";
import {toModel, toModelPermissionSummary} from "./incoming-rest-data-converters";
import {Model} from "../../models/domain/Model";
import {ModelPermissionSummary} from "../../models/domain/ModelPermissionsSummary";
import {ModelPermissions} from "../../models/domain/ModelPermissions";
import {ModelUserPermissions} from "../../models/domain/ModelUserPermissions";

export class DomainModelService extends AbstractDomainService {

  public createModel(domain: DomainId, collection: string, data: { [key: string]: any }): Promise<string> {
    const url = this._getDomainUrl(domain, `models`);
    return this
      ._post<{ id: string }>(url, {
        collection,
        data
      })
      .then(resp => resp.id);
  }

  public createOrUpdateModel(domain: DomainId, collection: string, id: string, data: { [key: string]: any }): Promise<string> {
    const url = this._getDomainUrl(domain, `models/${id}`);
    return this
      ._put<void>(url, {
        collection,
        data
      })
      .then(() => id);
  }

  public deleteModel(domain: DomainId, id: string): Promise<void> {
    const url = this._getDomainUrl(domain, `models/${id}`);
    return this._delete<void>(url);
  }

  public getModelById(domain: DomainId, id: String, data?: boolean): Promise<Model> {
    const url = this._getDomainUrl(domain, `models/${id}`);
    return this
      ._get<ModelData>(url, {data})
      .then(toModel);
  }

  public queryModels(domain: DomainId, query: String): Promise<Model[]> {
    const url = this._getDomainUrl(domain, `model-query`);
    return this
      ._post<ModelData[]>(url, {query})
      .then(models => models.map(toModel));
  }

  public getModelsInCollection(domain: DomainId, collectionId: string): Promise<Model[]> {
    const url = this._getDomainUrl(domain, `collections/${collectionId}/models`);
    return this._get<ModelData[]>(url).then(models => models.map(toModel));
  }

  //
  // Permissions
  //

  public getModelPermissionSummary(domainId: DomainId,
                                   modelId: string): Promise<ModelPermissionSummary> {
    const url = this._getDomainUrl(domainId, `models/${modelId}/permissions`);
    return this
      ._get<ModelPermissionSummaryData>(url)
      .then(toModelPermissionSummary);
  }

  public setOverrideCollectionWorldPermissions(domainId: DomainId,
                                               modelId: string,
                                               overrideWorld: boolean): Promise<void> {
    const url = this._getDomainUrl(domainId, `models/${modelId}/permissions/override`);
    const body = {overrideWorld};
    return this._put<void>(url, body);
  }

  public setModelWorldPermissions(domainId: DomainId,
                                  modelId: string,
                                  permissions: ModelPermissions): Promise<void> {
    const url = this._getDomainUrl(domainId, `models/${modelId}/permissions/world`);
    return this._put<void>(url, permissions);
  }

  public setModelUserPermissions(domainId: DomainId,
                                 modelId: string,
                                 permissions: ModelUserPermissions): Promise<void> {
    const url = this._getDomainUrl(domainId, `models/${modelId}/permissions/user/${permissions.userId.username}`);
    return this._put<void>(url, permissions.permissions);
  }

  public deleteModelUserPermissions(domainId: DomainId,
                                    modelId: string,
                                    username: string): Promise<void> {
    const url = this._getDomainUrl(domainId, `models/${modelId}/permissions/user/${username}`);
    return this._delete<void>(url);
  }
}

export const domainModelService = new DomainModelService();
