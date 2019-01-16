import {action, decorate, observable} from "mobx";
import {DomainDescriptor} from "../models/DomainDescriptor";

export class DomainStore {

  public domains: DomainDescriptor[] = [];

  public setDomains(domains: DomainDescriptor[]): void {
    this.domains = domains;
  }

  public addDomain(domain: DomainDescriptor): void {
    this.domains.push(domain);
  }

  public removeDomain(namespace: string, id: string): void {
    const index = this.domains.findIndex(d => d.namespace === namespace && d.id === id);
    if (index >= 0) {
      this.domains.splice(index, 1);
    }
  }
}

decorate(DomainStore, {
  domains: observable,
  addDomain: action,
  removeDomain: action,
  setDomains: action
});

export const domainStore = new DomainStore();