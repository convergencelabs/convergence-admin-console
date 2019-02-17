import {DomainId} from "../models/DomainId";

export function domainUrl(baseUrl: string, namespace: string, domainId: string): string {
  return `${baseUrl}/${namespace}/${domainId}`;
}

export function toDomainUrl(baseUrl: string, domainId: DomainId, path: string): string {
  return `${baseUrl}/domain/${domainId.namespace}/${domainId.id}/${path}`;
}