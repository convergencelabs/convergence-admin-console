import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {objectToMap} from "../utils/map-utils";
import {PasswordConfig} from "../models/PasswordConfig";
import {CONFIG} from "../constants/config";

export class ConfigService extends AbstractAuthenticatedService {
  public getServerRestUrl(): string {
    return "http://localhost:8081/v1";
  }

  public getServerRealtimeUrl(): string {
    return "http://localhost:8080";
  }

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
      })
  }

  public setPasswordConfig(config: PasswordConfig): Promise<void> {
    const body: any = {};
    body[CONFIG.Passwords.MinimumLength] = config.minLength;
    body[CONFIG.Passwords.RequireUpperCase] = config.requireUpper;
    body[CONFIG.Passwords.RequireLowerCase] = config.requireLower;
    body[CONFIG.Passwords.RequireNumeric] = config.requireDigit;
    body[CONFIG.Passwords.RequireSpecialCharacters] = config.requireSpecial;
    return this
      ._post("config", body)
      .then(() => undefined);
  }
}

export const configService = new ConfigService();
