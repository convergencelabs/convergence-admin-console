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

import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {DomainDescriptor} from "../models/DomainDescriptor";
import {DomainStatus} from "../models/DomainStatus";
import {DomainId} from "../models/DomainId";
import {DomainStatistics} from "../models/domain/DomainStatistics";
import {DomainStatisticsData} from "./domain/common-rest-data";
import {DomainAvailability} from "../models/DomainAvailability";

export interface DomainDescriptorData {
  namespace: string;
  domainId: string;
  displayName: string;
  owner: string;
  schemaVersion?: string;
  availability: string;
  status: string;
}

export class DomainService extends AbstractAuthenticatedService {
  public getDomains(namespace?: string, filter?: string, offset?: number, limit?: number): Promise<DomainDescriptor[]> {
    return this
        ._get<DomainDescriptorData[]>("domains", this._filterParams({namespace, filter, offset, limit}, [""]))
        .then(domains => domains.map(DomainService._toDomainDescriptor));
  }

  public getDomain(domainId: DomainId): Promise<DomainDescriptor> {
    return this
        ._get<DomainDescriptorData>(`domains/${domainId.namespace}/${domainId.id}`)
        .then(DomainService._toDomainDescriptor);
  }

  public getDomainStats(domainId: DomainId): Promise<DomainStatistics> {
    return this
        ._get<DomainStatisticsData>(`domains/${domainId.namespace}/${domainId.id}/stats`)
        .then(DomainService._toDomainStatistics);
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

  public setDomainAvailability(domainId: DomainId, availability: DomainAvailability): Promise<void> {
    const data = {availability};
    return this
        ._put<void>(`domains/${domainId.namespace}/${domainId.id}/availability`, data)
        .then(() => {
        })
  }

  public deleteDomain(domainId: DomainId): Promise<void> {
    return this._delete<void>(`domains/${domainId.namespace}/${domainId.id}`);
  }

  public changeDomainId(domainId: DomainId, id: string) {
    const data = {id};
    return this
        ._put<void>(`domains/${domainId.namespace}/${domainId.id}/id`, data)
        .then(() => {
        })
  }

  public static _toDomainStatistics(data: DomainStatisticsData): DomainStatistics {
    return new DomainStatistics(
        data.activeSessionCount,
        data.userCount,
        data.modelCount,
        data.dbSize
    );
  }

  public static _toDomainDescriptor(data: DomainDescriptorData): DomainDescriptor {
    let status: DomainStatus;
    switch (data.status) {
      case DomainStatus.READY:
        status = DomainStatus.READY;
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
      case DomainStatus.SCHEMA_UPGRADE_REQUIRED:
        status = DomainStatus.SCHEMA_UPGRADE_REQUIRED;
        break;
      case DomainStatus.SCHEMA_UPGRADING:
        status = DomainStatus.SCHEMA_UPGRADING;
    }

    let availability: DomainAvailability = DomainAvailability.ONLINE;
    switch (data.availability) {
      case DomainAvailability.ONLINE:
        availability = DomainAvailability.ONLINE;
        break;
      case DomainAvailability.MAINTENANCE:
        availability = DomainAvailability.MAINTENANCE;
        break;
      case DomainAvailability.OFFLINE:
        availability = DomainAvailability.OFFLINE;
        break;
    }
    return new DomainDescriptor(
        new DomainId(data.namespace, data.domainId),
        data.displayName,
        data.schemaVersion || null,
        availability,
        status!);
  }
}

export const domainService = new DomainService();
