/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {objectToMap} from "../../utils/map-utils";

export class DomainMemberService extends AbstractDomainService {

  public getDomainMembers(domainId: DomainId): Promise<Map<string, string>> {
    const url = this._getDomainUrl(domainId,`members`);
    return this._get<{[key: string]: string}>(url).then(resp => objectToMap(resp));
  }

  public setDomainMemberRole(domainId: DomainId, username: string, role: string): Promise<void> {
    const data = {role};
    const url = this._getDomainUrl(domainId,`members/${username}`);
    return this._put<void>(url, data);
  }

  public removeDomainMember(domainId: DomainId, username: string): Promise<void> {
    const url = this._getDomainUrl(domainId,`members/${username}`);
    return this._delete<void>(url);
  }
}

export const domainMemberService = new DomainMemberService();
