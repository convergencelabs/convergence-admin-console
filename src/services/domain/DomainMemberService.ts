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
