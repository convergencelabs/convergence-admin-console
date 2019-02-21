import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {DomainDescriptor} from "../models/DomainDescriptor";
import {DomainStatus} from "../models/DomainStatus";
import {DomainId} from "../models/DomainId";

export interface DomainDescriptorData {
  namespace: string;
  domainId: string;
  displayName: string;
  owner: string;
  status: string;
}

export class DomainService extends AbstractAuthenticatedService {
  public getDomains(namespace?: string, filter?: string, offset?: number, limit?: number): Promise<DomainDescriptor[]> {
    const params: any = {};
    return this
      ._get<DomainDescriptorData[]>("domains", this._filterParams({namespace, filter, offset, limit}, [""]))
      .then(domains => domains.map(DomainService._toDomainDescriptor));
  }

  public getDomain(domainId: DomainId): Promise<DomainDescriptor> {
    return this
      ._get<DomainDescriptorData>(`domains/${domainId.namespace}/${domainId.id}`)
      .then(DomainService._toDomainDescriptor);
  }

  public createDomain(domainId: DomainId, displayName: string): Promise<void> {
    const data = {namespace: domainId.namespace, id: domainId.id, displayName};
    return this._post<void>("domains", data);
  }

  public updateDomain(domainId: DomainId, displayName: string): Promise<DomainDescriptor> {
    const data = {displayName};
    return this
      ._put<DomainDescriptorData>(`domains/${domainId.namespace}/${domainId.id}`, data)
      .then(DomainService._toDomainDescriptor);
  }

  public deleteDomain(domainId: DomainId): Promise<void> {
    return this._delete<void>(`domains/${domainId.namespace}/${domainId.id}`);
  }

  public static _toDomainDescriptor(data: DomainDescriptorData): DomainDescriptor {
    let status: DomainStatus;
    switch (data.status) {
      case DomainStatus.ONLINE:
        status = DomainStatus.ONLINE;
        break;
      case DomainStatus.OFFLINE:
        status = DomainStatus.OFFLINE;
        break;
      case DomainStatus.INITIALIZING:
        status = DomainStatus.INITIALIZING;
        break;
      case DomainStatus.ERROR:
        status = DomainStatus.ERROR;
        break;
      case DomainStatus.DELETING:
        status = DomainStatus.DELETING;
        break;
      case DomainStatus.MAINTENANCE:
        status = DomainStatus.MAINTENANCE;
        break;
    }
    return new DomainDescriptor(
      data.namespace,
      data.domainId,
      data.displayName,
      status!);
  }
}

export const domainService = new DomainService();
