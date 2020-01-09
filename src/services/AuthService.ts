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

import {AbstractService} from "./AbstractService";

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface ValidateRestResponse {
  valid: boolean;
  username?: string;
  expiresIn?: number;
}

export interface ValidateResponse {
  valid: boolean;
  username?: string;
  expiresAt?: Date;
  expiresIn?: number;
}

export class AuthService extends AbstractService {
  public login(username: string, password: string): Promise<AuthResponse> {
    return this._post<AuthResponse>("auth/login", {username, password});
  }

  public validateToken(token: string): Promise<ValidateRestResponse> {
    return this
      ._post<ValidateRestResponse>("auth/validate", {token})
      .then(resp => {
        const {valid, username, expiresIn} = resp;
        return {
          valid,
          username,
          expiresAt: expiresIn !== undefined ? new Date(Date.now() + expiresIn) : undefined,
          expiresIn
        }
      });
  }
}

export const authService = new AuthService();
