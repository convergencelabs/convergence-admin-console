/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {action, decorate, observable} from "mobx";
import {DomainDescriptor} from "../models/DomainDescriptor";

export class DomainStore {

  public selectedDomain: DomainDescriptor | null = null;

  public selectDomain(domain: DomainDescriptor): void {
    this.selectedDomain = domain;
  }
}

decorate(DomainStore, {
  selectedDomain: observable,
  selectDomain: action
});

export const domainStore = new DomainStore();