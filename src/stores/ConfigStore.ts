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

export class ConfigStore {
  public configLoaded: boolean = false;
  public namespacesEnabled: boolean = true;
  public userNamespacesEnabled: boolean = true;
  public defaultNamespace: string = "";

  constructor() {
    makeAutoObservable(this, {
      configLoaded: observable,
      namespacesEnabled: observable,
      userNamespacesEnabled: observable,
      setNamespacesEnabled: action,
      setUserNamespacesEnabled: action,
      setConfigLoaded: action
    });
  }

  public setNamespacesEnabled(enabled: boolean): void {
    this.namespacesEnabled = enabled;
  }

  public setUserNamespacesEnabled(enabled: boolean): void {
    this.userNamespacesEnabled = enabled;
  }

  public setDefaultNamespace(namespace: string): void {
    this.defaultNamespace = namespace;
  }

  public setConfigLoaded(loaded: boolean): void {
    this.configLoaded = loaded;
  }
}



export const configStore = new ConfigStore();