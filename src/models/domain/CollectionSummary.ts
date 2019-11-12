/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class CollectionSummary {
  constructor(public readonly id: string,
              public readonly description: string,
              public readonly modelCount: number) {
    Object.freeze(this);
  }
}
