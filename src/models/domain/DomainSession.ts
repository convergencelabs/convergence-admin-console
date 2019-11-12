/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DomainUserId} from "./DomainUserId";

export class DomainSession {
  constructor(
    public readonly id: string,
    public readonly userId: DomainUserId,
    public readonly connected: Date,
    public readonly disconnected: Date | null,
    public readonly authMethod: string,
    public readonly client: string,
    public readonly clientVersion: string,
    public readonly clientMetaData: string,
    public readonly remoteHost: string
  ) {
    Object.freeze(this);
  }
}