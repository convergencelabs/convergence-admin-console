/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DomainDescriptor} from "./DomainDescriptor";

export class NamespaceAndDomains {
  constructor(public id: string,
              public displayName: string,
              public domains: DomainDescriptor[]
  ) {
    Object.freeze(this);
  }
}
