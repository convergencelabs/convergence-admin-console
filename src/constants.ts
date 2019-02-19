export interface AdminConsoleConfig {
  convergenceRestApiUrl: string;
  convergenceRealtimeApiUrl: string;
}

export const CONFIG: AdminConsoleConfig = {
  convergenceRestApiUrl: "http://localhost:8081/v1",
  convergenceRealtimeApiUrl: "http://localhost:8080/"
}
