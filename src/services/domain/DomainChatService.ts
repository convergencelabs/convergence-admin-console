/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import {DomainId} from "../../models/DomainId";
import {AbstractDomainService} from "./AbstractDomainService";
import {ChatInfoData, CreateChatData, PagedRestData} from "./common-rest-data";
import {ChatInfo} from "../../models/domain/ChatInfo";
import {toChatEvent, toChatInfo} from "./incoming-rest-data-converters";
import {PagedData} from "../../models/PagedData";
import {ChatEvent} from "../../models/domain/ChatEvent";

export class DomainChatService extends AbstractDomainService {

  public getChats(domain: DomainId, filter?: String, offset: number = 0, limit: number = 10): Promise<PagedData<ChatInfo>> {
    const url = this._getDomainUrl(domain, "chats");
    return this
      ._get<PagedRestData<ChatInfoData>>(url, {filter, offset, limit})
      .then(result => {
        const data = result.data.map(toChatInfo);
        return new PagedData(data, result.startIndex, result.totalResults)
      })
  }

  public getChat(domain: DomainId, chatId: string): Promise<ChatInfo> {
    const url = this._getDomainUrl(domain, `chats/${chatId}`);
    return this._get<ChatInfoData>(url).then(toChatInfo)
  }

  public setChatName(domain: DomainId, chatId: string, name: string): Promise<void> {
    const url = this._getDomainUrl(domain, `chats/${chatId}/name`);
    return this._put<void>(url, {name});
  }

  public setChatTopic(domain: DomainId, chatId: string, topic: string): Promise<void> {
    const url = this._getDomainUrl(domain, `chats/${chatId}/topic`);
    return this._put<void>(url, {topic});
  }

  public deleteChat(domain: DomainId, chatId: string): Promise<void> {
    const url = this._getDomainUrl(domain, `chats/${chatId}`);
    return this._delete<void>(url);
  }

  public createChat(domain: DomainId, data: CreateChatData): Promise<void> {
    const url = this._getDomainUrl(domain, "chats");
    return this._post<void>(url, data);
  }

  public getChatEvents(domain: DomainId, chatId: string, offset?: number, limit?: number, filter?: string): Promise<PagedData<ChatEvent>> {
    const url = this._getDomainUrl(domain, `chats/${chatId}/events`);
    const params = {filter, offset, limit};
    return this
      ._get<PagedRestData<any>>(url, params)
      .then(result => {
        return new PagedData<ChatEvent>(result.data.map(toChatEvent), result.startIndex, result.totalResults)
      });
  }
}

export const domainChatService = new DomainChatService();
