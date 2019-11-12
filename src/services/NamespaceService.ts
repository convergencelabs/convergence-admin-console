/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {Namespace} from "../models/Namespace";
import {DomainDescriptorData, DomainService} from "./DomainService";
import {NamespaceAndDomains} from "../models/NamespaceAndDomains";

interface NamespaceAndDomainsData {
  id: string;
  displayName: string;
  domains: DomainDescriptorData[];
}

interface NamespaceData {
  id: string;
  displayName: string;
}

export class NamespaceService extends AbstractAuthenticatedService {
  public getNamespaces(filter?: string, offset?: number, limit?: number): Promise<NamespaceAndDomains[]> {
    return this
      ._get<NamespaceAndDomainsData[]>("namespaces", {filter, offset, limit})
      .then(domains => domains.map(NamespaceService._toNamespaceAndDomains));
  }

  public getNamespace(id: string): Promise<Namespace> {
    return this
      ._get<NamespaceData>(`namespaces/${id}`)
      .then(namespaceData => NamespaceService._toNamespace(namespaceData));
  }

  public createNamespace(id: string, displayName: string): Promise<void> {
    return this._post<void>("namespaces", {id, displayName});
  }

  public deleteNamespace(id: string): Promise<void> {
    return this._delete<void>(`namespaces/${id}`);
  }

  private static _toNamespaceAndDomains(data: NamespaceAndDomainsData): NamespaceAndDomains {
    return new NamespaceAndDomains(
      data.id,
      data.displayName,
      data.domains.map(DomainService._toDomainDescriptor)
      );
  }

  private static _toNamespace(data: NamespaceData): Namespace {
    return new Namespace(
      data.id,
      data.displayName
    );
  }
}

export const namespaceService = new NamespaceService();
