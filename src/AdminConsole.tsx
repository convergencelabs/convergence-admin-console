import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps
} from "react-router-dom";
import {LoginForm} from "./components/common/LoginForm/";
import {PrivateRoute} from "./containers/PrivateRoute";
import {Root} from "./containers/Root";
import {MainLayout} from "./containers/MainLayout";
import {AuthStore} from "./stores/AuthStore";
import {injectObserver} from "./utils/mobx-utils";

interface InjectedStores {
  authStore: AuthStore;
}

class App extends Component<InjectedStores, {}> {
  render() {
    return (
      <Root>
        <Router>
          <Switch>
            <Route
              path="/login"
              render={(props: RouteComponentProps) => (<LoginForm {...props}/>)}
            />
            <PrivateRoute loggedIn={this.props.authStore.authenticated} path="/" component={MainLayout}/>
          </Switch>
        </Router>
      </Root>
    );
  }
}

export const AdminConsole = injectObserver<{}>(["authStore"], App);


