/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export enum DomainUserType {
  NORMAL = "normal",
  CONVERGENCE = "convergence",
  ANONYMOUS = "anonymous"
}

export class DomainUserId {
  constructor(public type: DomainUserType,
              public username: string) {
    Object.freeze(this);
  }
}
