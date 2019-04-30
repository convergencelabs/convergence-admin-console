import {DomainId} from "../models/DomainId";
import {AppConfig} from "../stores/AppConfig";

export function domainRealtimeUrl(namespace: string, domainId: string): string {
  return `${AppConfig.realtimeApiUrl}${namespace}/${domainId}`;
}

export function toDomainRoute(domainId: DomainId, path: string): string {
  return `/domain/${domainId.namespace}/${domainId.id}/${path}`;
}