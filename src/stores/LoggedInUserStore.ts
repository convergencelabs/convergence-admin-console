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

import {action, makeAutoObservable, observable} from "mobx";
import {LoggedInUser} from "../models/LoggedInUser";

export class LoggedInUserStore {
  public loggedInUser: LoggedInUser | null = null;

  constructor() {
    makeAutoObservable(this, {
      loggedInUser: observable,
      setLoggedInUser: action,
      logout: action
    });
  }

  public setLoggedInUser(loggedInUser: LoggedInUser): void {
    this.loggedInUser = loggedInUser;
  }

  public isServerAdmin(): boolean {
    return this.loggedInUser !== null && this.loggedInUser.serverRole === "Server Admin";
  }

  public isDomainAdmin(): boolean {
    return this.loggedInUser !== null && this.loggedInUser.serverRole === "Domain Admin";
  }

  public isDeveloper(): boolean {
    return this.loggedInUser !== null && this.loggedInUser.serverRole === "Developer";
  }

  public logout(): void {
    this.loggedInUser = null;
  }
}

export const loggedInUserStore = new LoggedInUserStore();