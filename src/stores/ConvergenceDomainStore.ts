import {action, decorate, observable} from "mobx";
import {ConvergenceDomain, Convergence} from "@convergence/convergence";
import {DomainId} from "../models/DomainId";
import {domainConvergenceJwtService} from "../services/domain/DomainConvergenceUserJwtService";
import {CONFIG} from "../constants";

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
      console.log("Disconnecting domain: ", this.domainId);
      this.domain.dispose();
    }
    this.domain = null;
    this.domainId = null;
  }

  public connect(domainId: DomainId): Promise<void> {
    console.log("Connecting to domain: ", domainId);
    this.domainId = domainId;
    return domainConvergenceJwtService
      .getJwt(this.domainId)
      .then((jwt) => {
        const url = `${CONFIG.convergenceRealtimeApiUrl}${domainId.namespace}/${domainId.id}`;
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