/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class ServerStatus {
  constructor(public readonly version: string,
              public readonly distribution: string,
              public readonly status: string,
              public readonly namespaces: number,
              public readonly domains: number
  ) {
    Object.freeze(this);
  }
}
