import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {NamespaceAndDomains} from "../models/Namespace";
import {DomainDescriptorData, DomainService} from "./DomainService";

interface NamespaceDescriptorData {
  id: string;
  displayName: string;
  domains: DomainDescriptorData[]
}

export class NamespaceService extends AbstractAuthenticatedService {
  public getNamespaces(): Promise<NamespaceAndDomains[]> {
    return this
      ._get<NamespaceDescriptorData[]>("namespaces")
      .then(domains => domains.map(NamespaceService._toNamespaceAndDomains));
  }

  public createNamespace(id: string, displayName: string): Promise<void> {
    return this._post<void>("namespaces", {id, displayName});
  }

  private static _toNamespaceAndDomains(data: NamespaceDescriptorData): NamespaceAndDomains {
    return new NamespaceAndDomains(
      data.id,
      data.displayName,
      data.domains.map(DomainService._toDomainDescriptor)
      );
  }
}

export const namespaceService = new NamespaceService();
