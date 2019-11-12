/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export class NamespaceConfig {
  constructor(
    public readonly namespacesEnabled: boolean,
    public readonly userNamespacesEnabled: boolean,
    public readonly defaultNamespace: string
  ) {
    Object.freeze(this);
  }
}