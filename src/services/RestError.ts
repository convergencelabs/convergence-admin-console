/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class RestError extends Error {
  constructor(message: string, public code: string, public details: {[key: string]: any}) {
    super(message);

    this.name = 'RestError';

    if (this.details === undefined) {
      this.details = {};
    }

    Object.setPrototypeOf(this, RestError.prototype);
  }
}