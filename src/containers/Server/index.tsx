/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Route, RouteComponentProps, Switch} from 'react-router';
import {ServerDashboard} from "../../pages/server/main/ServerDashboard";
import {Domains} from "../../pages/server/domains/Domains";
import {NavLayout} from "../../components/common/NavLayout";
import {ServerSideNavigation} from "../../components/server/ServerSideNavigation";
import {Settings} from "../../pages/server/settings/";
import {ServerUsers} from "../../pages/server/users/Users";
import {CreateUser} from "../../pages/server/users/CreateUser";
import {CreateDomain} from "../../pages/server/domains/CreateDomain";
import {Namespaces} from "../../pages/server/namespaces/Namespaces";
import {CreateNamespace} from "../../pages/server/namespaces/CreateNamespace";
import {EditNamespace} from "../../pages/server/namespaces/EditNamespace";
import {EditUser} from "../../pages/server/users/EditUser";
import {SetUserPassword} from "../../pages/server/users/SetUserPassword";
import {ProfilePage} from "../../pages/user/Profile";
import {PageNotFound} from "../../components/common/PageNotFound";
import {STORES} from "../../stores/StoreConstants";
import {injectAs} from "../../utils/mobx-utils";
import {ConfigStore} from "../../stores/ConfigStore";
import {AccountSettingsPage} from "../../pages/user/AccountSettings";
import {CreateApiKey} from "../../pages/user/AccountSettings/CreateApiKey";
import {EditApiKey} from "../../pages/user/AccountSettings/EditApiKey";

interface InjectedProps extends RouteComponentProps {
  configStore: ConfigStore;
}

export class ServerContainerComponent extends React.Component<InjectedProps, {}> {
  public render(): ReactNode {
    const {match} = this.props;
    const namespaces = this.props.configStore.namespacesEnabled ? [
        <Route exact path={`${match.url}namespaces`} key="0" render={(props) => <Namespaces {...props}/>}/>,
        <Route exact path={`${match.url}create-namespace`} key="1" render={(props) => <CreateNamespace {...props}/>}/>,
        <Route exact path={`${match.url}namespaces/:id`} key="2" render={(props) => <EditNamespace {...props}/>}/>
      ] :
      [];
    return (
      <NavLayout sideNav={<ServerSideNavigation/>}>
        <Switch>
          <Route exact path={`${match.url}users`} render={(props) => <ServerUsers {...props}/>}/>
          <Route exact path={`${match.url}create-user`} render={(props) => <CreateUser {...props}/>}/>
          <Route exact path={`${match.url}users/:username`} render={(props) => <EditUser {...props}/>}/>
          <Route exact path={`${match.url}users/:username/set-password`} render={(props) => <SetUserPassword {...props}/>}/>
          {namespaces}
          <Route exact path={`${match.url}domains`} render={(props) => <Domains {...props}/>}/>
          <Route exact path={`${match.url}create-domain`} render={(props) => <CreateDomain {...props}/>}/>
          <Route exact path={`${match.url}settings`} render={(props) => <Settings/>}/>
          <Route exact path={`${match.url}profile`} render={(props) => <ProfilePage/>}/>
          <Route exact path={`${match.url}account-settings`} render={(props) => <AccountSettingsPage {...props}/>}/>
          <Route exact path={`${match.url}create-api-key`} render={(props) => <CreateApiKey {...props}/>}/>
          <Route exact path={`${match.url}api-keys/:key`} render={(props) => <EditApiKey {...props}/>}/>
          <Route exact path={`${match.url}`} render={(props) => <ServerDashboard {...props} />}/>
          <Route component={PageNotFound}/>
        </Switch>
      </NavLayout>
    );
  }
}

const injections = [STORES.CONFIG_STORE];
export const ServerContainer = injectAs<RouteComponentProps>(injections, ServerContainerComponent);

