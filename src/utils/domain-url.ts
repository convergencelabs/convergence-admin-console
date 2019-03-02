import {DomainId} from "../models/DomainId";
import {AppConfig} from "../stores/AppConfig";
import {configStore} from "../stores/ConfigStore";


export function domainUrl(namespace: string, domainId: string): string {
  return configStore.namespacesEnabled ?
    `${AppConfig.realtimeApiUrl}${namespace}/${domainId}` :
    `${AppConfig.realtimeApiUrl}${domainId}`;
}

export function toDomainUrl(domainId: DomainId, path: string): string {
  return configStore.namespacesEnabled ?
    `/domain/${domainId.namespace}/${domainId.id}/${path}` :
    `/domain/${domainId.id}/${path}`;
}