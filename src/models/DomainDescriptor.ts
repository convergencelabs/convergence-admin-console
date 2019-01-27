import {DomainStatus} from "./DomainStatus";

export class DomainDescriptor {
  constructor(public namespace: string,
              public id: string,
              public displayName: string,
              public owner: string,
              public status: DomainStatus
  ) {
    Object.freeze(this);
  }
}
