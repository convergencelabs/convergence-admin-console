import React, {ReactNode} from "react";
import {Page} from "../../../components/common/Page";
import {injectAs} from "../../../utils/mobx-utils";
import {ProfileStore} from "../../../stores/ProfileStore";
import {STORES} from "../../../stores/StoreConstants";
import {ProfileForm} from "./ProfileForm";
import {ChangePasswordForm} from "./ChangePasswordForm";

interface InjectedProps {
  profileStore: ProfileStore;
}

class ProfilePageComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Profile"}
  ];

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <ProfileForm username={this.props.profileStore.profile!.username}/>
        <ChangePasswordForm/>
      </Page>
    );
  }
}

export const ProfilePage = injectAs<{}>([STORES.PROFILE_STORE], ProfilePageComponent);
