const CONVERGENCE_ADMIN_CONSOLE_CONFIG = {
  baseUrl: `{{ getenv "CONVERGENCE_CONSOLE_BASE_URL" }}`,
  restApiUrl: `{{ getenv "CONVERGENCE_SERVER_REST_API" }}`,
  realtimeApiUrl: `{{ getenv "CONVERGENCE_SERVER_REALTIME_API" }}`
};
