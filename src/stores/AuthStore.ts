import {action, decorate, observable} from "mobx";

export class AuthStore {
  public authenticated: boolean = true;

  public setAuthenticated(authenticated: boolean): void {
    this.authenticated = authenticated;
  }
}

decorate(AuthStore, {
  authenticated: observable,
  setAuthenticated: action
});

export const authStore = new AuthStore();