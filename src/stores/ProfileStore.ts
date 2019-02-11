import {action, decorate, observable} from "mobx";
import {UserProfile} from "../models/UserProfile";

export class ProfileStore {
  public profile: UserProfile | null = null;

  public setProfile(profile: UserProfile): void {
    this.profile = profile;
  }

  public logout(): void {
    this.profile = null;
  }
}

decorate(ProfileStore, {
  profile: observable,
  setProfile: action,
  logout: action
});

export const profileStore = new ProfileStore();