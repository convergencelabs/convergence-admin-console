import {DomainDescriptor} from "./DomainDescriptor";

export class NamespaceAndDomains {
  constructor(public id: string,
              public displayName: string,
              public domains: DomainDescriptor[]
  ) {
    Object.freeze(this);
  }
}
