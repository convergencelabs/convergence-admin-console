import {AbstractAuthenticatedService} from "../AbstractAuthenticatedService";
import {DomainId} from "../../models/DomainId";

export class AbstractDomainService extends AbstractAuthenticatedService {
  protected _getDomainUrl(domain: DomainId, relPath: string): string {
    return `domains/${domain.namespace}/${domain.id}/${relPath}`;
  }
}