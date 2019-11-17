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

import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ModelData, ModelPermissionSummaryData, PagedData} from "./common-rest-data";
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

  public queryModels(domain: DomainId, query: String): Promise<PagedData<Model>> {
    const url = this._getDomainUrl(domain, `model-query`);
    return this
      ._post<PagedData<ModelData>>(url, {query})
      .then(pagedModels => {
        const models = pagedModels.data.map(toModel);
        return {
          data: models,
          startIndex: pagedModels.startIndex,
          totalResults: pagedModels.totalResults
        };
      });
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
