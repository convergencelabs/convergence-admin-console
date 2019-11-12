/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DomainStatus} from "./DomainStatus";
import {DomainId} from "./DomainId";

export class DomainDescriptor {
  constructor(public namespace: string,
              public id: string,
              public displayName: string,
              public status: DomainStatus
  ) {
    Object.freeze(this);
  }

  public toDomainId(): DomainId {
    return new DomainId(this.namespace, this.id);
  }
}
