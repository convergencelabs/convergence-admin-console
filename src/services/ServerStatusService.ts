import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {ServerStatusData} from "./domain/rest-data";
import {ServerStatus} from "../models/ServerStatus";


export class ServerStatusService extends AbstractAuthenticatedService {
  public getStatus(): Promise<ServerStatus> {
    return this
      ._get<ServerStatusData>("status")
      .then(status => new ServerStatus(
        status.version,
        status.distribution,
        status.status,
        status.namespaces,
        status.domains
      ));
  }
}

export const serverStatusService = new ServerStatusService();
