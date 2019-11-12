/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class DomainStatistics {
  constructor(public readonly activeSessionCount: number,
              public readonly userCount: number,
              public readonly modelCount: number,
              public readonly dbSize: number) {
    Object.freeze(this);
  }
}