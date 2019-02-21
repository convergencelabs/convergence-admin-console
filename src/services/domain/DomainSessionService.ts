import {DomainId} from "../../models/DomainId";
import {DomainSessionData} from "./common-rest-data";
import {AbstractDomainService} from "./AbstractDomainService";
import {toDomainSession} from "./incoming-rest-data-converters";
import {DomainSession} from "../../models/domain/DomainSession";

export interface DomainSessionFilter {
  sessionId?: string;
  username?: string;
  remoteHost?: string;
  authMethod?: string;
  excludeDisconnected?: boolean;
  sessionType?: string;
}

export class DomainSessionService extends AbstractDomainService {

  public getSessions(
    domainId: DomainId,
    filter: DomainSessionFilter = {},
    offset: number = 0,
    limit: number = 20,): Promise<DomainSession[]> {

    const params = {limit, offset, ...filter};
    const url = this._getDomainUrl(domainId, "sessions");
    return this._get<DomainSessionData[]>(url, params)
      .then(sessions => sessions.map(toDomainSession));
  }
}

export const domainSessionService = new DomainSessionService();
