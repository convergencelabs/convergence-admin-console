/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
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
