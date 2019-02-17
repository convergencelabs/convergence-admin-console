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
}

export const domainCollectionService = new DomainCollectionService();
