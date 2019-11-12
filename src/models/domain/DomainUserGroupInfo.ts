/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class DomainUserGroupInfo {
  constructor(public readonly id: string,
              public readonly description: string) {
    Object.freeze(this);
  }
}
