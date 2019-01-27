import {AbstractService} from "./AbstractService";

export interface AuthResponse {
  token: string;
  expiration: number;
}

export class AuthService extends AbstractService {
  public login(username: string, password: string): Promise<AuthResponse> {
    return this._post<AuthResponse>("auth/login", {username, password});
  }
}

export const authService = new AuthService();
