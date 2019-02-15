import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {UserProfile} from "../models/UserProfile";

interface UserProfileData {
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class ProfileService extends AbstractAuthenticatedService {
  public getProfile(): Promise<UserProfile> {
    return this
      ._get<UserProfileData>("user/profile")
      .then(profile => {
        return new UserProfile(
          profile.username,
          profile.displayName,
          profile.firstName,
          profile.lastName,
          profile.email
        );
      });
  }

  public updateProfile(profile: UserProfile): Promise<void> {
    const body = {
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email
    };
    return this._put<void>("user/profile", body)
  }

  public setPassword(password: string): Promise<void> {
    const body = {password};
    return this._put<void>("user/password", body)
  }
}

export const profileService = new ProfileService();
