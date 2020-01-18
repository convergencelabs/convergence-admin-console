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

import React, {Component} from 'react';
import {BrowserRouter as Router, Route, RouteComponentProps, Switch} from "react-router-dom";
import {LoginForm} from "./components/common/LoginForm/";
import {PrivateRoute} from "./containers/PrivateRoute";
import {Root} from "./containers/Root";
import {MainLayout} from "./containers/MainLayout";
import {AuthStore} from "./stores/AuthStore";
import {injectObserver} from "./utils/mobx-utils";
import {AppConfig} from "./stores/AppConfig";
import {STORES} from "./stores/StoreConstants";
import {LoggedOut} from "./components/common/LoggedOut";
import {Redirect} from "react-router";

interface InjectedStores {
  authStore: AuthStore;
}

class App extends Component<InjectedStores, {}> {
  render() {
    let content = null;
    if (this.props.authStore.timedOut) {
      // Todo Figure out a better way to do this.
      setTimeout(() => this.props.authStore.clearTimedOut());
      content = (
        <Redirect push to={{pathname: "/logged-out"}}/>
      )
    } else {
      content = (
        <Switch>
          <Route
            path="/login"
            render={(props: RouteComponentProps) => (<LoginForm {...props}/>)}
          />
          <Route
            path="/logged-out"
            render={(props: RouteComponentProps) => (<LoggedOut {...props}/>)}
          />
          <PrivateRoute loggedIn={this.props.authStore.authenticated} path="/" component={MainLayout}/>
        </Switch>
      );
    }
    return (
      <Root>
        <Router basename={AppConfig.baseUrl}>
          {content}
        </Router>
      </Root>
    );
  }
}

const injections = [STORES.AUTH_STORE, STORES.CONFIG_STORE];
export const AdminConsole = injectObserver<{}>(injections, App);
