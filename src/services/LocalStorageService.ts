export interface IAuthToken {
  token: string;
  expires: number;
}

const AUTH_TOKEN = "auth_token";

export class LocalStorageService {

  public setAuthToken(token: IAuthToken): void {
    this.setJson(AUTH_TOKEN, token);
  }

  public getAuthToken(): IAuthToken {
    return this.getJson(AUTH_TOKEN);
  }

  public clearAuthToken(): void {
    return this.remove(AUTH_TOKEN);
  }


  public getJson(key: string): any {
    const raw = window.localStorage.getItem(key);
    if (typeof raw === "string") {
      return JSON.parse(raw);
    } else {
      return null;
    }
  }

  public setJson(key: string, value: any): void {
    const str = JSON.stringify(value);
    window.localStorage.setItem(key, str);
  }

  public remove(key: string): void {
    window.localStorage.removeItem(key)
  }
}

export const localStorageService = new LocalStorageService();
