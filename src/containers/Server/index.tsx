import * as React from 'react';
import {ReactNode} from "react";
import {Route, RouteComponentProps, Switch} from 'react-router';
import {ServerDashboard} from "../../pages/server/ServerDashboard";
import {Domains} from "../../pages/server/Domains";
import {NavLayout} from "../../components/NavLayout";
import {ServerSideNavigation} from "../../components/ServerSideNavigation";
import {Settings} from "../../pages/server/Settings";
import {ServerUsers} from "../../pages/server/Users";
import {CreateUser} from "../../pages/server/CreateUser";

export class ServerContainer extends React.Component<RouteComponentProps, {}> {
  public render(): ReactNode {
    const {match} = this.props;
    return (
      <NavLayout sideNav={<ServerSideNavigation/>}>
        <Switch>
          <Route exact path={`${match.url}users`} render={(props) => <ServerUsers {...props}/>}/>
          <Route path={`${match.url}users/create`} render={(props) => <CreateUser {...props}/>}/>
          <Route path={`${match.url}domains`} render={(props) => <Domains {...props}/>}/>
          <Route path={`${match.url}settings`} render={(props) => <Settings />}/>
          <Route path={`${match.url}`} render={(props) => <ServerDashboard {...props} />}/>
        </Switch>
      </NavLayout>
    );
  }
}