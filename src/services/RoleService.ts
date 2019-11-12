/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";

export enum RoleTargetType {
  SERVER = "server",
  NAMESPACE = "namespace",
  DOMAIN = "domain"
}

export class RoleTarget {
  public static namespace(namespaceId: string): RoleTarget {
    return new RoleTarget(RoleTargetType.NAMESPACE, namespaceId);
  }

  constructor(
    public type: RoleTargetType,
    public namespaceId?: string,
    public domainId?: string) {
  }
}

export class RoleService extends AbstractAuthenticatedService {
  public getUserRoles(target: RoleTarget): Promise<Map<string, string>> {
    const url = RoleService._buildBaseUrl(target);
    return this
      ._get<{ [key: string]: string }>(url)
      .then(resp => {
        const userRoles = new Map();
        Object.keys(resp).forEach(username => userRoles.set(username, resp[username]));
        return userRoles;
      });
  }

  public deleteUserRoles(target: RoleTarget, username: string): Promise<void> {
    const url = RoleService._buildBaseUrl(target);
    return this._delete<void>(`${url}/${username}`);
  }

  public setUserRole(target: RoleTarget, username: string, role: String): Promise<void> {
    const url = RoleService._buildBaseUrl(target);
    const map: { [key: string]: any } = {};
    map[username] = role;
    return this._post<void>(url, map);
  }

  private static _buildBaseUrl(target: RoleTarget): string {
    switch (target.type) {
      case RoleTargetType.SERVER:
        return `roles/server`;
      case RoleTargetType.NAMESPACE:
        return `roles/namespace/${target.namespaceId}`;
      case RoleTargetType.DOMAIN:
        return `roles/namespace/${target.namespaceId}/${target.domainId}`;
    }
  }
}

export const roleService = new RoleService();
