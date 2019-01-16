import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps
} from "react-router-dom";
import {LoginForm} from "./components/LoginForm/index";
import {PrivateRoute} from "./PrivateRoute";
import {Root} from "./containers/Root";
import {Main} from "./containers/Main";
import {observer} from "mobx-react";
import {authStore} from "./stores/AuthStore";

export const App = observer(class App extends Component <{}, {}> {

  loginSuccess = () => {
    authStore.setAuthenticated(true);
  }

  render() {
    return (
      <Root>
        <Router>
          <Switch>
            <Route
              path="/login"
              render={(props: RouteComponentProps) => (<LoginForm {...props} loginSuccess={this.loginSuccess}/>)}
            />
            <PrivateRoute loggedIn={authStore.authenticated} path="/" component={Main}/>
          </Switch>
        </Router>
      </Root>
    );
  }
});
