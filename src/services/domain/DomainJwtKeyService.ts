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
import {DomainJwtKeyData} from "./common-rest-data";
import {DomainJwtKey} from "../../models/domain/DomainJwtKey";
import {toDomainJwtKey} from "./incoming-rest-data-converters";

export class DomainJwtKeyService extends AbstractDomainService {

  public getKeys(domainId: DomainId, filter?: string): Promise<DomainJwtKey[]> {
    const url = this._getDomainUrl(domainId,`jwtKeys`);
    return this._get<DomainJwtKeyData[]>(url, {filter})
      .then(keys => keys.map(toDomainJwtKey));
  }

  public getKey(domainId: DomainId, keyId: string): Promise<DomainJwtKey> {
    const url = this._getDomainUrl(domainId,`jwtKeys/${keyId}`);
    return this._get<DomainJwtKeyData>(url)
      .then(toDomainJwtKey);
  }

  public createKey(domainId: DomainId, key: DomainJwtKey): Promise<void> {
    const body = {
      id: key.id,
      description: key.description,
      key: key.key,
      enabled: key.enabled
    };
    const url = this._getDomainUrl(domainId,`jwtKeys`);
    return this._post<void>(url, body);
  }

  public updateKey(domainId: DomainId, key: DomainJwtKey): Promise<void> {
    const body = {
      description: key.description,
      key: key.key,
      enabled: key.enabled
    };
    const url = this._getDomainUrl(domainId,`jwtKeys/${key.id}`);
    return this._put<void>(url, body);
  }

  public deleteKey(domainId: DomainId, keyId: string): Promise<void> {
    const url = this._getDomainUrl(domainId,`jwtKeys/${keyId}`);
    return this._delete<void>(url);
  }

  public generateKey(): Promise<{publicKey: string, privateKey: string}> {
    const url = "util/keygen";
    return this._get<any>(url);
  }
}

export const domainJwtKeyService = new DomainJwtKeyService();
