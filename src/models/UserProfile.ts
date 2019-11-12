/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class UserProfile {
  constructor(
    public username: string,
    public displayName: string,
    public firstName: string,
    public lastName: string,
    public email: string) {
  }
}
