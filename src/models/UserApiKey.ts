/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class UserApiKey {
  constructor(public key: string,
              public name: string,
              public enabled: boolean,
              public lastUsed?: Date
  ) {
    Object.freeze(this);
  }
}