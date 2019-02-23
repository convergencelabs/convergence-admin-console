import {DomainId} from "../models/DomainId";
import {AppConfig} from "../stores/AppConfig";

export function domainUrl(namespace: string, domainId: string): string {
  return `${AppConfig.realtimeApiUrl}${namespace}/${domainId}`;
}

export function toDomainUrl(baseUrl: string, domainId: DomainId, path: string): string {
  return `${baseUrl}/domain/${domainId.namespace}/${domainId.id}/${path}`;
}