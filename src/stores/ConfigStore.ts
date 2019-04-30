import {action, decorate, observable} from "mobx";

export class ConfigStore {
  public configLoaded: boolean = false;
  public namespacesEnabled: boolean = true;
  public userNamespacesEnabled: boolean = true;
  public defaultNamespace: string = "";

  public setNamespacesEnabled(enabled: boolean): void {
    this.namespacesEnabled = enabled;
  }

  public setUserNamespacesEnabled(enabled: boolean): void {
    this.userNamespacesEnabled = enabled;
  }

  public setDefaultNamespace(namespace: string): void {
    this.defaultNamespace = namespace;
  }

  public setConfigLoaded(loaded: boolean): void {
    this.configLoaded = loaded;
  }
}

decorate(ConfigStore, {
  configLoaded: observable,
  namespacesEnabled: observable,
  userNamespacesEnabled: observable,
  setNamespacesEnabled: action,
  setUserNamespacesEnabled: action,
  setConfigLoaded: action
});

export const configStore = new ConfigStore();