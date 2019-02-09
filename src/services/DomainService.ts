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
  public getDomains(): Promise<DomainDescriptor[]> {
    return this
      ._get<DomainDescriptorData[]>("domains")
      .then(domains => domains.map(DomainService._toDomainDescriptor));
  }

  public getDomain(namespace: string, domainId: string): Promise<DomainDescriptor> {
    return this
      ._get<DomainDescriptorData>(`domains/${namespace}/${domainId}`)
      .then(DomainService._toDomainDescriptor);
  }

  public static _toDomainDescriptor(data: DomainDescriptorData): DomainDescriptor {
    // FIXME status
    return new DomainDescriptor(
      data.namespace,
      data.domainId,
      data.displayName,
      data.owner,
      DomainStatus.ONLINE);
  }
}

export const domainService = new DomainService();
