/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export interface ServerStatusData {
  version: string;
  distribution: string;
  status: string;
  namespaces: number;
  domains: number;
}
