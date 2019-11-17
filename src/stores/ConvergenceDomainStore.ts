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
import {Convergence, ConvergenceDomain} from "@convergence/convergence";
import {DomainId} from "../models/DomainId";
import {domainConvergenceJwtService} from "../services/domain/DomainConvergenceUserJwtService";
import {domainRealtimeUrl} from "../utils/domain-url";

export class ConvergenceDomainStore {
  public domain: ConvergenceDomain | null = null;
  public domainId: DomainId | null = null;

  public activateDomain(domain: DomainId): Promise<void> {
    if (this.domainId !== null && this.domainId.equals(domain)) {
      return Promise.resolve();
    }

    this.disconnect();
    return this.connect(domain);
  }

  public disconnect(): void {
    if (this.domain !== null) {
      if (this.domain.session().isConnected()) {
        this.domain.dispose();
      }
    }
    this.domain = null;
    this.domainId = null;
  }

  public connect(domainId: DomainId): Promise<void> {
    this.domainId = domainId;
    return domainConvergenceJwtService
      .getJwt(this.domainId)
      .then((jwt) => {
        const url = domainRealtimeUrl(domainId.namespace, domainId.id);
        return Convergence.connectWithJwt(url, jwt);
      })
      .then(domain => {
        this._setDomain(domain);
        return;
      });
  }

  public _setDomain(domain: ConvergenceDomain): void {
    this.domain = domain;
  }
}

decorate(ConvergenceDomainStore, {
  domain: observable,
  domainId: observable,
  activateDomain: action,
  connect: action,
  disconnect: action,
  _setDomain: action
});

export const convergenceDomainStore = new ConvergenceDomainStore();