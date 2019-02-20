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
