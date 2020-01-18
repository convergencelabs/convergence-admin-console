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

import {action, decorate, observable} from "mobx";
import {authService} from "../services/AuthService";
import {localStorageService} from "../services/LocalStorageService";

// We will check for logout 30 seconds before the token expires.
const SESSION_CHECK_PADDING = 30 * 1000;

export class AuthStore {
  public authenticated: boolean = false;
  public timedOut: boolean = false;
  public authToken: string | null = null;
  private _validationTimeout: any | null = null;

  public setAuthenticated(authToken: string): void {
    this.authenticated = true;
    this.authToken = authToken;
    this._logoutCheck();
  }

  public logout(): void {
    this.authToken = null;
    this.authenticated = false;
    if (this._validationTimeout !== null) {
      clearTimeout(this._validationTimeout);
      this._validationTimeout = null;
    }
    localStorageService.clearAuthToken();
  }

  public timeOut(): void {
    this.timedOut = true;
    this.logout();
  }

  public clearTimedOut(): void {
    this.timedOut = false;
  }

  private _logoutCheck(): void {
    if (this.authToken !== null) {
      authService.validateToken(this.authToken).then((resp) => {
        const {valid, expiresIn} = resp;
        if (!valid) {
          this.timeOut();
        } else {
          const remaining = (expiresIn || 0) - SESSION_CHECK_PADDING;
          if (remaining <= 0) {
            this.timeOut();
          } else {
            this._validationTimeout = setTimeout(() => this._logoutCheck(), remaining);
          }
        }
      });
    }
  }
}

decorate(AuthStore, {
  authenticated: observable,
  authToken: observable,
  timedOut: observable,
  setAuthenticated: action,
  logout: action,
  timeOut: action,
  clearTimedOut: action
});

export const authStore = new AuthStore();