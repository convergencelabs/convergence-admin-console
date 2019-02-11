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
}

export const profileService = new ProfileService();
