/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class DomainMember {
  constructor(public readonly username: string,
              public readonly role: string) {
    Object.freeze(this);
  }
}