import {action, decorate, observable} from "mobx";

export class AuthStore {
  public authenticated: boolean = false;
  public authToken: string | null = null;

  public setAuthenticated(authToken: string): void {
    this.authenticated = true;
    this.authToken = authToken;
  }

  public logout(): void {
    this.authToken = null;
    this.authenticated = false;
  }
}

decorate(AuthStore, {
  authenticated: observable,
  authToken: observable,
  setAuthenticated: action,
  logout: action
});

export const authStore = new AuthStore();