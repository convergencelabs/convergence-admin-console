/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
      ._get<UserApiKeyData[]>("apiKeys")
      .then(domains => domains.map(ApiKeyService._toUserApiKey));
  }

  public getApiKey(keyId: string): Promise<UserApiKey> {
    return this
      ._get<UserApiKeyData>(`apiKeys/${keyId}`)
      .then(ApiKeyService._toUserApiKey);
  }

  public createUserApiKey(name: string, enabled: boolean): Promise<void> {
    const data = {name, enabled};
    return this._post<void>("apiKeys", data);
  }

  public updateUserApiKey(key: string, name: string, enabled: boolean): Promise<UserApiKey> {
    const data = {key, name, enabled};
    return this
      ._put<UserApiKeyData>(`apiKeys/${key}`, data)
      .then(ApiKeyService._toUserApiKey);
  }

  public deleteUserApiKey(key: string): Promise<void> {
    return this._delete<void>(`apiKeys/${key}`);
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
