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
import {ProfilePage} from "../../pages/server/main/Profile";
import {PageNotFound} from "../../components/common/PageNotFound";

export class ServerContainer extends React.Component<RouteComponentProps, {}> {
  public render(): ReactNode {
    const {match} = this.props;
    return (
      <NavLayout sideNav={<ServerSideNavigation/>}>
        <Switch>
          <Route exact path={`${match.url}users`} render={(props) => <ServerUsers {...props}/>}/>
          <Route exact path={`${match.url}create-user`} render={(props) => <CreateUser {...props}/>}/>
          <Route exact path={`${match.url}users/:username`} render={(props) => <EditUser {...props}/>}/>
          <Route exact path={`${match.url}users/:username/set-password`}
                 render={(props) => <SetUserPassword {...props}/>}/>
          <Route exact path={`${match.url}namespaces`} render={(props) => <Namespaces {...props}/>}/>
          <Route exact path={`${match.url}create-namespace`} render={(props) => <CreateNamespace {...props}/>}/>
          <Route exact path={`${match.url}namespaces/:id`} render={(props) => <EditNamespace {...props}/>}/>
          <Route exact path={`${match.url}domains`} render={(props) => <Domains {...props}/>}/>
          <Route exact path={`${match.url}create-domain`} render={(props) => <CreateDomain {...props}/>}/>
          <Route exact path={`${match.url}settings`} render={(props) => <Settings/>}/>
          <Route exact path={`${match.url}profile`} render={(props) => <ProfilePage/>}/>
          <Route exact path={`${match.url}`} render={(props) => <ServerDashboard {...props} />}/>
          <Route component={PageNotFound}/>
        </Switch>
      </NavLayout>
    );
  }
}
