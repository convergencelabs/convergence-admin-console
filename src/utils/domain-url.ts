export function domainUrl(baseUrl: string, namespace: string, domainId: string): string {
  return `${baseUrl}/${namespace}/${domainId}`;
}