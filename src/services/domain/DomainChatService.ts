import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";


export class DomainChatService extends AbstractDomainService {

  public getChats(domain: DomainId, filter?: String, offset: number = 0, limit: number = 10): Promise<any[]> {
    const url = this._getDomainUrl(domain, "chats");
    return this._get<any[]>(url, {filter, offset, limit})
  }

  public deleteChat(domain: DomainId, id: string): Promise<void> {
   return Promise.resolve();
  }
}

export const domainChatService = new DomainChatService();
