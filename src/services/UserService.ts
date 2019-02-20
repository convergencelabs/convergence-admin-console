import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {ConvergenceUser} from "../models/ConvergenceUser";

export interface ConvergenceUserData {
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  lastLogin: number;
  serverRole: string;
}

export interface CreateUserData {
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: number;
  serverRole: string;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  serverRole: string;
}

export class UserService extends AbstractAuthenticatedService {

  public getUsers(filter?: String, offset: number = 0, limit: number = 10): Promise<ConvergenceUser[]> {
    return this
      ._get<ConvergenceUserData[]>("users", {filter, offset, limit})
      .then(users => users.map(UserService._toConvergenceUser));
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

  public updateUser(username: string, userData: UpdateUserData): Promise<void> {
    return this
      ._put<ConvergenceUserData>(`users/${username}`, userData)
      .then(() => undefined);
  }

  public deleteUser(username: string): Promise<void> {
    return this
      ._delete<void>(`users/${username}`)
      .then(() => undefined);
  }

  public setPassword(username: string, password: string): Promise<void> {
    return this
      ._post<void>(`users/${username}/password`, {password})
      .then(() => undefined);
  }

  public static _toConvergenceUser(data: ConvergenceUserData): ConvergenceUser {
    const lastLogin = data.lastLogin ? new Date(data.lastLogin) : null;
    return new ConvergenceUser(
      data.username,
      data.displayName,
      data.firstName,
      data.lastName,
      data.email,
      lastLogin,
      data.serverRole);
  }
}

export const userService = new UserService();
