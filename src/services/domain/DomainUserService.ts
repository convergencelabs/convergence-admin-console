import {DomainId} from "../../models/DomainId";
import {DomainUser} from "../../models/domain/DomainUser";
import {CreateDomainUserData, DomainUserData, UpdateDomainUserData} from "./common-rest-data";
import {AbstractDomainService} from "./AbstractDomainService";
import {toDomainUser} from "./incoming-rest-data-converters";

export class DomainUserService extends AbstractDomainService {

  public getUsers(domainId: DomainId, filter?: String, offset: number = 0, limit: number = 10): Promise<DomainUser[]> {
    const url = this._getDomainUrl(domainId, `users`);
    return this
      ._get<DomainUserData[]>(url, {filter, offset, limit})
      .then(users => users.map(toDomainUser));
  }

  public getUser(domainId: DomainId, username: string): Promise<DomainUser> {
    const url = this._getDomainUrl(domainId, `users/${username}`);
    return this
      ._get<DomainUserData>(url)
      .then(toDomainUser);
  }

  public createUser(domainId: DomainId, userData: CreateDomainUserData): Promise<void> {
    const url = this._getDomainUrl(domainId, `users`);
    return this
      ._post<void>(url, userData);
  }

  public updateUser(domainId: DomainId, username: string, userData: UpdateDomainUserData): Promise<void> {
    const url = this._getDomainUrl(domainId, `users/${username}`);
    return this
      ._put<void>(url, userData);
  }

  public deleteUser(domainId: DomainId, username: string): Promise<void> {
    const url = this._getDomainUrl(domainId, `users/${username}`);
    return this
      ._delete<void>(url)
      .then(() => undefined);
  }

  public setPassword(domainId: DomainId, username: string, password: string): Promise<void> {
    const url = this._getDomainUrl(domainId, `users/${username}/password`);
    return this
      ._put<void>(url, {password})
      .then(() => undefined);
  }
}

export const domainUserService = new DomainUserService();
