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

export interface IAuthToken {
  token: string;
  expiresAt: number;
}

const AUTH_TOKEN = "auth_token";

export class LocalStorageService {

  public setAuthToken(token: IAuthToken): void {
    this.setJson(AUTH_TOKEN, token);
  }

  public getAuthToken(): IAuthToken {
    return this.getJson(AUTH_TOKEN);
  }

  public clearAuthToken(): void {
    return this.remove(AUTH_TOKEN);
  }

  public getJson(key: string): any {
    const raw = window.localStorage.getItem(key);
    if (typeof raw === "string") {
      return JSON.parse(raw);
    } else {
      return null;
    }
  }

  public setJson(key: string, value: any): void {
    const str = JSON.stringify(value);
    window.localStorage.setItem(key, str);
  }

  public remove(key: string): void {
    window.localStorage.removeItem(key)
  }
}

export const localStorageService = new LocalStorageService();
