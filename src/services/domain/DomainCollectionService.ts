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
import {CollectionSummary} from "../../models/domain/CollectionSummary";
import {Collection} from "../../models/domain/Collection";
import {CollectionData, CollectionSummaryData, CollectionUpdateData} from "./common-rest-data";
import {toCollection, toCollectionSummary} from "./incoming-rest-data-converters";
import {toCollectionData, toCollectionUpdateData} from "./outgoing-rest-data-converters";

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

  public getCollectionSummaries(domain: DomainId, filter?: String, offset: number = 0, limit: number = 10): Promise<CollectionSummary[]> {
    const url = this._getDomainUrl(domain, "collectionSummary");
    return this
      ._get<CollectionSummaryData[]>(url, {filter, offset, limit})
      .then(summaries => summaries.map(toCollectionSummary));
  }

  public getCollections(domain: DomainId, filter?: String, offset: number = 0, limit: number = 10): Promise<Collection[]> {
    const url = this._getDomainUrl(domain, "collections");
    return this
      ._get<CollectionData[]>(url, {filter, offset, limit})
      .then(summaries => summaries.map(toCollection));
  }
}

export const domainCollectionService = new DomainCollectionService();
