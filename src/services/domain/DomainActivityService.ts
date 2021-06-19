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
import {ActivityData, CreateActivityData, PagedRestData} from "./common-rest-data";
import {toActivityInfo} from "./incoming-rest-data-converters";
import {PagedData} from "../../models/PagedData";
import {ActivityInfo} from "../../models/domain/ActivityInfo";

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

  public deleteActivity(domain: DomainId, activityType: string, activityId: string): Promise<void> {
    const url = this._getDomainUrl(domain, `activities/${activityType}/${activityId}`);
    return this._delete<void>(url);
  }

  public createActivity(domain: DomainId, data: CreateActivityData): Promise<void> {
    const url = this._getDomainUrl(domain, "activities");
    return this._post<void>(url, data);
  }
}

export const domainActivityService = new DomainActivityService();
