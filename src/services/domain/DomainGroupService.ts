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
import {DomainUserGroup} from "../../models/domain/DomainUserGroup";
import {DomainUserGroupSummary} from "../../models/domain/DomainUserGroupSummary";
import {DomainUserGroupData, DomainUserGroupSummaryData} from "./common-rest-data";
import {toDomainUserGroup, toDomainUserGroupSummary} from "./incoming-rest-data-converters";

export class DomainGroupService extends AbstractDomainService {

  public createUserGroup(domainId: DomainId, group: DomainUserGroup): Promise<void> {
    const body = {
      id: group.id,
      description: group.description,
      members: group.members
    };

    const url = this._getDomainUrl(domainId,"groups");
    return this._post<void>(url, body);
  }

  public removeUserGroup(domainId: DomainId, groupId: string): Promise<void> {
    const url = this._getDomainUrl(domainId,`groups/${groupId}`);
    return this._delete<void>(url);
  }

  public getUserGroupSummaries(domainId: DomainId,
                               filter?: string,
                               offset?: number,
                               limit?: number): Promise<DomainUserGroupSummary[]> {
    const params = {type: "summary", filter, offset, limit};
    const url = this._getDomainUrl(domainId,"groups");
    return this._get<DomainUserGroupSummaryData[]>(url, params)
      .then(groups => groups.map(toDomainUserGroupSummary));
  }

  public getUserGroup(domainId: DomainId, groupId: string): Promise<DomainUserGroup> {
    const url = this._getDomainUrl(domainId,`groups/${groupId}`);
    return this._get<DomainUserGroupData>(url)
      .then(toDomainUserGroup);
  }

  public updateUserGroup(domainId: DomainId, groupId: string, group: DomainUserGroup): Promise<void> {
    const body = {
      id: group.id,
      description: group.description,
      members: group.members
    };
    const url = this._getDomainUrl(domainId,`groups/${groupId}`);
    return this._put<void>(url, body);
  }
}

export const domainGroupService = new DomainGroupService();
