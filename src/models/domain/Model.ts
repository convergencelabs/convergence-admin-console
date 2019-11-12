/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class Model {
  constructor(public readonly id: string,
              public readonly collection: string,
              public readonly version: number,
              public readonly created: Date,
              public readonly modified: Date,
              public readonly data?: {[key: string]: any}
  ) {
    Object.freeze(this);
  }
}
