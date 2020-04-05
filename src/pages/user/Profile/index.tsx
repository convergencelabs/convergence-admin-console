/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import {Page} from "../../../components/common/Page";
import {injectAs} from "../../../utils/mobx-utils";
import {LoggedInUserStore} from "../../../stores/LoggedInUserStore";
import {STORES} from "../../../stores/StoreConstants";
import {ProfileForm} from "./ProfileForm";
import {ChangePasswordForm} from "./ChangePasswordForm";

interface InjectedProps {
  profileStore: LoggedInUserStore;
}

class ProfilePageComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Profile"}
  ];

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <ProfileForm username={this.props.profileStore.loggedInUser!.username}/>
        <ChangePasswordForm/>
      </Page>
    );
  }
}

export const ProfilePage = injectAs<{}>([STORES.PROFILE_STORE], ProfilePageComponent);
