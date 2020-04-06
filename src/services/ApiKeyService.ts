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
import {UserApiKey} from "../models/UserApiKey";

export interface UserApiKeyData {
  key: string;
  name: string;
  enabled: boolean;
  lastUsed?: string;
}

export class ApiKeyService extends AbstractAuthenticatedService {
  public getApiKeys(): Promise<UserApiKey[]> {
    return this
      ._get<UserApiKeyData[]>("user/apiKeys")
      .then(domains => domains.map(ApiKeyService._toUserApiKey));
  }

  public getApiKey(keyId: string): Promise<UserApiKey> {
    return this
      ._get<UserApiKeyData>(`user/apiKeys/${keyId}`)
      .then(ApiKeyService._toUserApiKey);
  }

  public createUserApiKey(name: string, enabled: boolean): Promise<void> {
    const data = {name, enabled};
    return this._post<void>("user/apiKeys", data);
  }

  public updateUserApiKey(key: string, name: string, enabled: boolean): Promise<UserApiKey> {
    const data = {key, name, enabled};
    return this
      ._put<UserApiKeyData>(`user/apiKeys/${key}`, data)
      .then(ApiKeyService._toUserApiKey);
  }

  public deleteUserApiKey(key: string): Promise<void> {
    return this._delete<void>(`user/apiKeys/${key}`);
  }

  public static _toUserApiKey(data: UserApiKeyData): UserApiKey {
    const lastUsed = data.lastUsed ? new Date(data.lastUsed) : undefined;
    return new UserApiKey(
      data.key,
      data.name,
      data.enabled,
      lastUsed);
  }
}

export const apiKeyService = new ApiKeyService();
