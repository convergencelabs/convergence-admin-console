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
import {serverStatusService} from "../services/ServerStatusService";

// We will check the server status every ten seconds
const INTERVAL = 10 * 1000;

export class ServerStatusStore {
  private static nextDate(): Date {
    return new Date(Date.now() + INTERVAL)
  }

  private static calculateSecondsRemaining(nextCheck: Date): number | null {
    return Math.round(Math.max(0, (nextCheck.getTime() - Date.now()) / 1000));
  }

  private secondsTask: any = null;
  private nextCheck: Date = ServerStatusStore.nextDate();

  public online: boolean = true;
  public secondsUntilNextCheck = ServerStatusStore.calculateSecondsRemaining(this.nextCheck);

  constructor() {
    makeAutoObservable(this, {
      online: observable,
      secondsUntilNextCheck: observable,
      setSecondsUntilNextCheck: observable,
      setOnline: action,
    });

    setInterval(() => this._onlineCheck(), INTERVAL);
  }

  public setOnline(online: boolean): void {
    this.online = online;

    if (online) {
      this.clearSecondsTask();
    } else {
      this.nextCheck = ServerStatusStore.nextDate();
      this.setSecondsUntilNextCheck();
      this.startSecondsTask();
    }
  }

  public clearSecondsUntilNextCheck(): void {
    this.secondsUntilNextCheck = null;
  }

  public setSecondsUntilNextCheck(): void {
    this.secondsUntilNextCheck = ServerStatusStore.calculateSecondsRemaining(this.nextCheck);
  }

  private _onlineCheck(): void {
    this.clearSecondsUntilNextCheck();
    this.clearSecondsTask();
    serverStatusService.getHealth()
      .then(() => {
        this.setOnline(true);
      })
      .catch(() => {
        this.setOnline(false);
      })
  }

  private startSecondsTask(): void {
    if (this.secondsTask === null) {
      this.secondsTask = setInterval(() => {
        this.setSecondsUntilNextCheck();
      }, 1000)
    }
  }

  private clearSecondsTask(): void {
    if (this.secondsTask !== null) {
      clearTimeout(this.secondsTask);
      this.secondsTask = null;
    }
  }

}

export const serverStatusStore = new ServerStatusStore();