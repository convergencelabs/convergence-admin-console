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
import {Convergence, ConvergenceDomain} from "@convergence/convergence";
import {DomainId} from "../models/DomainId";
import {domainConvergenceJwtService} from "../services/domain/DomainConvergenceUserJwtService";
import {domainRealtimeUrl} from "../utils/domain-url";
import {DomainDescriptor} from "../models/DomainDescriptor";
import {DomainService} from "../services/DomainService";
import {RestError} from "../services/RestError";
import {DomainAvailability} from "../models/DomainAvailability";
import {DomainStatus} from "../models/DomainStatus";
import {DomainStatistics} from "../models/domain/DomainStatistics";

export class ActiveDomainStore {
  private domainService: DomainService;
  public domain: ConvergenceDomain | null = null;
  public domainStats: DomainStatistics | null = null;
  public domainDescriptor: DomainDescriptor | null = null;
  public error: string | null = null;
  private _reloadTask: any;

  constructor(domainService: DomainService) {
    this.domainService = domainService;

    makeAutoObservable(this, {
      domain: observable,
      domainDescriptor: observable,
      activateDomain: action,
      deactivate: action,
      _setRealtimeDomain: action,
      _setDomainDescriptor: action,
      _setDomainStats: action
    });
  }

  public refreshDomainDescriptor(): Promise<void> {
    if (this.domainDescriptor === null) {
      return Promise.reject("Can not refresh the domain if the domain is not set.")
    }
    return this.domainService.getDomain(this.domainDescriptor.domainId).then(d => {
      return this._setDomainDescriptor(d);
    });
  }

  private refreshDomainStats(): Promise<void> {
    if (this.domainDescriptor === null) {
      return Promise.reject("Can not refresh the domain stats the domain is not set.")
    }
    return this.domainService.getDomainStats(this.domainDescriptor.domainId).then(d => {
      return this._setDomainStats(d);
    });
  }

  public async activateDomain(domainId: DomainId): Promise<void> {
    if (this.domainDescriptor !== null && this.domainDescriptor.domainId.equals(domainId)) {
      return Promise.resolve();
    }

    this.deactivate();

    try {
      const domainDescriptor = await this.domainService.getDomain(domainId);
      const domainStats = await this.domainService.getDomainStats(domainId);
      this._setDomainStats(domainStats);
      return this._setDomainDescriptor(domainDescriptor);
    } catch (err) {
      this.error = "Unknown error loading domain.";
      if (err instanceof RestError) {
        if (err.code === "not_found") {
          this.error = `The domain '${domainId.namespace}/${domainId.id}' does not exist!`;
        } else {
          console.error(err);
        }
      } else {
        console.error(err);
      }
    }
  }

  public deactivate(): void {
    if (this.domain !== null) {
      if (this.domain.session().isConnected()) {
        this.domain.dispose();
      }
    }
    this.domain = null;
    this.domainDescriptor = null;

    if (this._reloadTask !== null) {
      clearTimeout(this._reloadTask);
    }
  }

  private connectRealtimeDomain(domainId: DomainId): Promise<ConvergenceDomain> {
    console.log("connectRealtimeDomain")
    return domainConvergenceJwtService
        .getJwt(domainId)
        .then((jwt) => {
          const url = domainRealtimeUrl(domainId);
          return Convergence.connectWithJwt(url, jwt);
        }).then(d => {
          d.on(ConvergenceDomain.Events.DISCONNECTED, () => {
            console.log("disconnected");
          })
          return d;
        });
  }

  public _setRealtimeDomain(domain: ConvergenceDomain | null): void {
    this.domain = domain
  }

  public _setDomainStats(stats: DomainStatistics): void {
    this.domainStats  = stats
  }

  public  _setDomainDescriptor(descriptor: DomainDescriptor): Promise<void> {
    this.domainDescriptor = descriptor;
    if (this._reloadTask !== null) {
      clearTimeout(this._reloadTask);
    }

    this._reloadTask = setTimeout(() => {
      this.refreshDomainDescriptor();
      this.refreshDomainStats();
    }, 5000);

    if (descriptor.status !== DomainStatus.READY || descriptor.availability === DomainAvailability.OFFLINE) {
      if (this.domain !== null) {
        this.domain.dispose();
        this._setRealtimeDomain(null);
        return Promise.resolve();
      } else {
        return Promise.resolve()
      }
    } else if (this.domain === null) {
      return this.connectRealtimeDomain(this.domainDescriptor.domainId).then(domain => {
        this._setRealtimeDomain(domain);
      });
    }  else {
      return Promise.resolve()
    }
  }
}
