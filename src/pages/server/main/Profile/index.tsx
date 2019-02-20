import * as React from 'react';
import {Page} from "../../../../components/common/Page/index";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {injectAs} from "../../../../utils/mobx-utils";
import {ProfileStore} from "../../../../stores/ProfileStore";
import {STORES} from "../../../../stores/StoreConstants";
import {ProfileForm} from "./ProfileForm";
import {ChangePasswordForm} from "./ChangePasswordForm";

interface InjectedProps {
  profileStore: ProfileStore;
}

class ProfilePageComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = new BasicBreadcrumbsProducer([
    {title: "Users", link: "/namespaces"},
    {title: "Profile"}
  ]);

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <ProfileForm username={this.props.profileStore.profile!.username}></ProfileForm>
        <ChangePasswordForm></ChangePasswordForm>
      </Page>
    );
  }
}

export const ProfilePage = injectAs<{}>([STORES.PROFILE_STORE], ProfilePageComponent);
