import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {objectToMap} from "../utils/map-utils";

export class ConfigService extends AbstractAuthenticatedService {
  public getServerRestUrl(): string {
    return "http://localhost:8080/rest/v1";
  }

  public getServerRealtimeUrl(): string {
    return "http://localhost:8080/realtime";
  }

  public getConfig(): Promise<Map<string, any>> {
    return this
      ._get<{[key: string]: any}>("config")
      .then(objectToMap);
  }
}

export const configService = new ConfigService();
