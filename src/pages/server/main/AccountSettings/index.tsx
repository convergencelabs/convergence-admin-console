import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {injectAs} from "../../../../utils/mobx-utils";
import {ProfileStore} from "../../../../stores/ProfileStore";
import {STORES} from "../../../../stores/StoreConstants";
import {ApiKeys} from "./ApiKeys";
import {RouteComponentProps} from "react-router";

interface InjectedProps extends RouteComponentProps {
  profileStore: ProfileStore;
}

class AccountSettingsComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs = [
    {title: "Account Settings"}
  ];

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <ApiKeys {...this.props}/>
      </Page>
    );
  }
}

export const AccountSettingsPage = injectAs<RouteComponentProps>([STORES.PROFILE_STORE], AccountSettingsComponent);
