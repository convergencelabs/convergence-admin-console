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
import {DomainDescriptor} from "../models/DomainDescriptor";

export class DomainStore {

  constructor() {
    makeAutoObservable(this, {
      selectedDomain: observable,
      selectDomain: action
    });
  }

  public selectedDomain: DomainDescriptor | null = null;

  public selectDomain(domain: DomainDescriptor): void {
    this.selectedDomain = domain;
  }
}



export const domainStore = new DomainStore();