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
import {Collection} from "../../models/domain/Collection";
import {CollectionData, CollectionSummaryData, CollectionUpdateData, PagedRestData} from "./common-rest-data";
import {toCollection, toCollectionSummary} from "./incoming-rest-data-converters";
import {toCollectionData, toCollectionUpdateData} from "./outgoing-rest-data-converters";
import {PagedData} from "../../models/PagedData";
import {CollectionSummary} from "../../models/domain/CollectionSummary";

export class DomainCollectionService extends AbstractDomainService {

  public createCollection(domain: DomainId, collection: Collection): Promise<void> {
    const url = this._getDomainUrl(domain, `collections`);
    const data: CollectionData = toCollectionData(collection);
    return this._post<void>(url, data);
  }

  public updateCollection(domain: DomainId, collection: Collection): Promise<void> {
    const url = this._getDomainUrl(domain, `collections/${collection.id}`);
    const data: CollectionUpdateData = toCollectionUpdateData(collection);
    return this._put<void>(url, data);
  }

  public deleteCollection(domain: DomainId, collectionId: string): Promise<void> {
    const url = this._getDomainUrl(domain, `collections/${collectionId}`);
    return this._delete<void>(url);
  }

  public getCollection(domain: DomainId, id: string): Promise<Collection> {
    const url = this._getDomainUrl(domain, `collections/${id}`);
    return this
      ._get<CollectionData>(url)
      .then(toCollection);
  }

  public getCollectionSummaries(domain: DomainId, filter?: String, offset: number = 0, limit: number = 25): Promise<PagedData<CollectionSummary>> {
    const url = this._getDomainUrl(domain, "collectionSummary");
    return this
      ._get<PagedRestData<CollectionSummaryData>>(url, {filter, offset, limit})
      .then(result => {
        const data = result.data.map(toCollectionSummary);
        return new PagedData(data, result.startIndex, result.totalResults);
      });
  }

  public getCollections(domain: DomainId, filter?: String, offset: number = 0, limit: number = 25): Promise<PagedData<Collection>> {
    const url = this._getDomainUrl(domain, "collections");
    return this
      ._get<PagedRestData<CollectionData>>(url, {filter, offset, limit})
      .then(results => {
        const data = results.data.map(toCollection);
        return new PagedData(data, results.startIndex, results.totalResults);
      });
  }
}

export const domainCollectionService = new DomainCollectionService();
