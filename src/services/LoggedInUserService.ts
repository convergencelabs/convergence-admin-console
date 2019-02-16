import {AbstractAuthenticatedService} from "./AbstractAuthenticatedService";
import {UserProfile} from "../models/UserProfile";
import {DomainDescriptorData, DomainService} from "./DomainService";
import {DomainDescriptor} from "../models/DomainDescriptor";
import {DomainId} from "../models/DomainId";

interface UserProfileData {
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class LoggedInUserService extends AbstractAuthenticatedService {
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

  public getFavoriteDomains(): Promise<DomainDescriptor[]> {
    return this
      ._get<DomainDescriptorData[]>("user/favoriteDomains")
      .then(resp => resp.map(DomainService._toDomainDescriptor));
  }

  public addFavoriteDomain(domainId: DomainId): Promise<void> {
    return this._put<void>(`user/favoriteDomains/${domainId.namespace}/${domainId.id}`);
  }

  public removeFavoriteDomain(domainId: DomainId): Promise<void> {
    return this._delete<void>(`user/favoriteDomains/${domainId.namespace}/${domainId.id}`);
  }
}

export const loggedInUserService = new LoggedInUserService();
