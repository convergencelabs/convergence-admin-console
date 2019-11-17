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

export class AuthStore {
  public authenticated: boolean = false;
  public authToken: string | null = null;

  public setAuthenticated(authToken: string): void {
    this.authenticated = true;
    this.authToken = authToken;
  }

  public logout(): void {
    this.authToken = null;
    this.authenticated = false;
  }
}

decorate(AuthStore, {
  authenticated: observable,
  authToken: observable,
  setAuthenticated: action,
  logout: action
});

export const authStore = new AuthStore();