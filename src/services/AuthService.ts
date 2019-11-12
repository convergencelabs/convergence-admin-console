/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
          expiresAt: expiresIn !== undefined ? new Date(Date.now() + expiresIn) : undefined
        }
      });
  }
}

export const authService = new AuthService();
