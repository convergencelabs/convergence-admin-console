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
import {
  ActivityData,
  CreateActivityData,
  GetPermissionsData,
  PagedRestData,
  SetPermissionsData
} from "./common-rest-data";
import {decodeDomainUserId, toActivityInfo} from "./incoming-rest-data-converters";
import {PagedData} from "../../models/PagedData";
import {ActivityInfo} from "../../models/domain/activity/ActivityInfo";
import {AllPermissions} from "../../models/domain/permissions/AllPermissions";
import {mapObject, objectToMap} from "../../utils/map-utils";
import {DomainUserIdMap} from "@convergence/convergence";
import {SetPermissions} from "../../models/domain/permissions/SetPermissions";
import {encodeDomainUserId} from "./outgoing-rest-data-converters";

export class DomainActivityService extends AbstractDomainService {

  public getActivities(domain: DomainId, type?: String, id?: string, offset: number = 0, limit: number = 10): Promise<PagedData<ActivityInfo>> {
    const url = this._getDomainUrl(domain, "activities");
    return this
        ._get<PagedRestData<ActivityData>>(url, {type, id, offset, limit})
        .then(result => {
          const data = result.data.map(toActivityInfo);
          return new PagedData(data, result.startIndex, result.totalResults)
        })
  }

  public getActivity(domain: DomainId, activityType: String, activityId: string): Promise<ActivityInfo> {
    const relPath = `activities/${activityType}/${activityId}`;
    const url = this._getDomainUrl(domain, relPath);
    return this
        ._get<ActivityData>(url)
        .then(result => {
          return toActivityInfo(result)
        })
  }

  public createActivity(domain: DomainId, data: CreateActivityData): Promise<void> {
    const url = this._getDomainUrl(domain, "activities");
    return this._post<void>(url, data);
  }

  public deleteActivity(domain: DomainId, activityType: string, activityId: string): Promise<void> {
    const relPath = `activities/${activityType}/${activityId}`;
    const url = this._getDomainUrl(domain, relPath);
    return this._delete<void>(url);
  }

  public getActivityPermissions(domain: DomainId, activityType: string, activityId: string): Promise<AllPermissions> {
    const relPath = `activities/${activityType}/${activityId}/permissions`;
    const url = this._getDomainUrl(domain, relPath);
    return this._get<GetPermissionsData>(url).then(p => {
      const userPermissions = new DomainUserIdMap<Set<string>>()
      objectToMap(p.userPermissions || {}).forEach((v, username) => {
        const userId = decodeDomainUserId(username);
        userPermissions.set(userId, new Set(v))
      });
      const groupPermissions: { [key: string]: Set<string> } =
          mapObject((p.groupPermissions || {}), (permissions) => new Set(permissions));
      return new AllPermissions(new Set(p.worldPermissions), userPermissions, objectToMap(groupPermissions));
    });
  }

  public setActivityPermissions(domain: DomainId, activityType: string, activityId: string, permissions: SetPermissions): Promise<void> {
    const data: SetPermissionsData = {};

    if (permissions.worldPermissions) {
      data.worldPermissions = {
        permissions: Array.from(permissions.worldPermissions.values())
      };
    }

    if (permissions.userPermissions) {
      const up: {[key: string]: string[]} = {};
      permissions.userPermissions.forEach((permissions, user) => {
        up[encodeDomainUserId(user)] = Array.from(permissions);
      })
      data.userPermissions = {
        permissions: up,
        replace: false
      };
    }

    if (permissions.groupPermissions) {
      const gp: {[key: string]: string[]} = {};
      permissions.groupPermissions.forEach((permissions, groupId) => {
        gp[groupId] = Array.from(permissions);
      })
      data.groupPermissions = {
        permissions: gp,
        replace: false
      };
    }

    const relPath = `activities/${activityType}/${activityId}/permissions`;
    const url = this._getDomainUrl(domain, relPath);
    return this._put<void>(url, data);
  }
}

export const domainActivityService = new DomainActivityService();
