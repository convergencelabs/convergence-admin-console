/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {DomainId} from "../models/DomainId";
import {AppConfig} from "../stores/AppConfig";

export function domainRealtimeUrl(namespace: string, domainId: string): string {
  return `${AppConfig.realtimeApiUrl}${namespace}/${domainId}`;
}

export function toDomainRoute(domainId: DomainId, path: string): string {
  return `/domain/${domainId.namespace}/${domainId.id}/${path}`;
}