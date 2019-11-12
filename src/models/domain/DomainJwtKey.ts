/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class DomainJwtKey {
  constructor(public id: string,
              public description: string,
              public updated: Date,
              public key: string,
              public enabled: boolean) {
    Object.freeze(this);
  }
}
