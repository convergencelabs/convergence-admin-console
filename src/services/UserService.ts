import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {ConvergenceUser} from "../models/ConvergenceUser";
import {ConvergenceUserInfo} from "../models/ConvergenceUserInfo";

export interface ConvergenceUserData {
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export interface ConvergenceUserInfoData {
  user: ConvergenceUserData;
  lastLogin: number;
  serverRole: string;
}

export interface CreateUserData {
  user: ConvergenceUserData;
  password: number;
  serverRole: string;
}

export class UserService extends AbstractAuthenticatedService {
  public getUsers(): Promise<ConvergenceUser[]> {
    return this
      ._get<ConvergenceUserData[]>("users")
      .then(domains => domains.map(UserService._toConvergenceUser));
  }

  public searchUsers(filter: String, offset: number = 0, limit: number = 10): Promise<ConvergenceUser[]> {
    return this
      ._get<ConvergenceUserData[]>("users", {filter, offset, limit})
      .then(domains => domains.map(UserService._toConvergenceUser));
  }

  public getUserInfo(): Promise<ConvergenceUserInfo[]> {
    return this
      ._get<ConvergenceUserInfoData[]>("userInfo")
      .then(domains => domains.map(UserService._toConvergenceUserInfo));
  }

  public getUser(username: string): Promise<ConvergenceUser> {
    return this
      ._get<ConvergenceUserData>(`users/${username}`)
      .then(UserService._toConvergenceUser);
  }

  public createUser(userData: CreateUserData): Promise<void> {
    return this
      ._post<ConvergenceUserData>("users", userData)
      .then(() => undefined);
  }

  public deleteUser(username: string): Promise<void> {
    return this
      ._delete<void>(`users/${username}`)
      .then(() => undefined);
  }

  public static _toConvergenceUser(data: ConvergenceUserData): ConvergenceUser {
    return new ConvergenceUser(
      data.username,
      data.displayName,
      data.firstName,
      data.lastName,
      data.email);
  }

  public static _toConvergenceUserInfo(data: ConvergenceUserInfoData): ConvergenceUserInfo {
    const user = UserService._toConvergenceUser(data.user);
    const lastLogin = data.lastLogin ? new Date(data.lastLogin) : null;
    return new ConvergenceUserInfo(user, lastLogin, data.serverRole);
  }
}

export const userService = new UserService();
