export class ConfigService {
  public getServerRestUrl(): string {
    return "http://localhost:8080/rest/v1";
  }

  public getServerRealtimeUrl(): string {
    return "http://localhost:8080/realtime";
  }
}

export const configService = new ConfigService();
