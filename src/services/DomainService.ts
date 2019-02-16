import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {DomainDescriptor} from "../models/DomainDescriptor";
import {DomainStatus} from "../models/DomainStatus";

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

  public getDomain(namespace: string, domainId: string): Promise<DomainDescriptor> {
    return this
      ._get<DomainDescriptorData>(`domains/${namespace}/${domainId}`)
      .then(DomainService._toDomainDescriptor);
  }

  public createDomain(namespace: string, id: string, displayName: string): Promise<void> {
    return this._post<void>("domains", {namespace, id, displayName});
  }

  public deleteDomain(namespace: string, id: string): Promise<void> {
    return this._delete<void>(`domains/${namespace}/${id}`);
  }

  public static _toDomainDescriptor(data: DomainDescriptorData): DomainDescriptor {
    // FIXME status
    return new DomainDescriptor(
      data.namespace,
      data.domainId,
      data.displayName,
      DomainStatus.ONLINE);
  }
}

export const domainService = new DomainService();
