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

import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {objectToMap} from "../utils/map-utils";
import {PasswordConfig} from "../models/PasswordConfig";
import {CONFIG} from "../constants/config";
import {NamespaceConfig} from "../models/NamespaceConfig";

export class ConfigService extends AbstractAuthenticatedService {
  public getConfig(): Promise<Map<string, any>> {
    return this
      ._get<{ [key: string]: any }>("config")
      .then(objectToMap);
  }

  public getAppConfig(): Promise<Map<string, any>> {
    return this
      ._get<{ [key: string]: any }>("config/app")
      .then(objectToMap);
  }

  public getPasswordConfig(): Promise<PasswordConfig> {
    return this
      .getAppConfig()
      .then(configs => {
        const minLen = configs.get(CONFIG.Passwords.MinimumLength) as number;
        const upperRequired = configs.get(CONFIG.Passwords.RequireUpperCase) as boolean;
        const lowerRequired = configs.get(CONFIG.Passwords.RequireLowerCase) as boolean;
        const digitRequired = configs.get(CONFIG.Passwords.RequireNumeric) as boolean;
        const specialRequired = configs.get(CONFIG.Passwords.RequireSpecialCharacters) as boolean;

        return new PasswordConfig(minLen, upperRequired, lowerRequired, digitRequired, specialRequired);
      });
  }

  public setPasswordConfig(config: PasswordConfig): Promise<void> {
    const body: any = {};
    body[CONFIG.Passwords.MinimumLength] = config.minLength;
    body[CONFIG.Passwords.RequireUpperCase] = config.requireUpper;
    body[CONFIG.Passwords.RequireLowerCase] = config.requireLower;
    body[CONFIG.Passwords.RequireNumeric] = config.requireDigit;
    body[CONFIG.Passwords.RequireSpecialCharacters] = config.requireSpecial;
    return this._post<void>("config", body);
  }

  public getNamespaceConfig(): Promise<NamespaceConfig> {
    return this
      .getAppConfig()
      .then(configs => {
        const enabled = configs.get(CONFIG.Namespaces.Enabled) as boolean;
        const userEnabled = configs.get(CONFIG.Namespaces.UserNamespacesEnabled) as boolean;
        const defaultNamespace = configs.get(CONFIG.Namespaces.DefaultNamespace) as string;
        return new NamespaceConfig(enabled, userEnabled, defaultNamespace);
      });
  }

  public setNamespaceConfig(config: NamespaceConfig): Promise<void> {
    const body: any = {};
    body[CONFIG.Namespaces.Enabled] = config.namespacesEnabled;
    body[CONFIG.Namespaces.UserNamespacesEnabled] = config.userNamespacesEnabled;
    body[CONFIG.Namespaces.DefaultNamespace] = config.defaultNamespace;
    return this._post<void>("config", body);
  }

  public getSessionTimeoutMinutes(): Promise<number> {
    return this
      .getAppConfig()
      .then(configs => {
        const timeout = configs.get(CONFIG.Sessions.Timeout) as number;
        return timeout;
      });
  }

  public setSessionTimeoutMinutes(timeout: number): Promise<void> {
    const body: any = {};
    body[CONFIG.Sessions.Timeout] = timeout;
    return this._post<void>("config", body);
  }
}

export const configService = new ConfigService();
