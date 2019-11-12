/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

interface AdminConsoleConfig {
  baseUrl: string;
  restApiUrl: string;
  realtimeApiUrl: string;
}

declare const CONVERGENCE_ADMIN_CONSOLE_CONFIG: AdminConsoleConfig;

if (CONVERGENCE_ADMIN_CONSOLE_CONFIG === undefined) {
  throw new Error("CONVERGENCE_ADMIN_CONSOLE_CONFIG was not defined.")
}

if (CONVERGENCE_ADMIN_CONSOLE_CONFIG.restApiUrl === undefined) {
  throw new Error("CONVERGENCE_ADMIN_CONSOLE_CONFIG.restApiUrl was not defined.");
}

if (CONVERGENCE_ADMIN_CONSOLE_CONFIG.realtimeApiUrl === undefined) {
  throw new Error("CONVERGENCE_ADMIN_CONSOLE_CONFIG.realtimeApiUrl was not defined.");
}

if (CONVERGENCE_ADMIN_CONSOLE_CONFIG.baseUrl === undefined) {
  throw new Error("CONVERGENCE_ADMIN_CONSOLE_CONFIG.baseUrl was not defined.");
}

const config = {...CONVERGENCE_ADMIN_CONSOLE_CONFIG};
export const AppConfig: AdminConsoleConfig = config;
