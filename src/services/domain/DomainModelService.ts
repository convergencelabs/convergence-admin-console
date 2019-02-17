import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ModelData} from "./common-rest-data";
import {toModel} from "./incoming-rest-data-converters";
import {Model} from "../../models/domain/Model";

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

  public getModelById(domain: DomainId, id: String): Promise<Model> {
    const url = this._getDomainUrl(domain, `models/${id}`);
    return this
      ._get<ModelData>(url)
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
}

export const domainModelService = new DomainModelService();
