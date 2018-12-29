import React, {Component, ComponentProps, ReactElement} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteProps,
  RouteComponentProps
} from "react-router-dom";
import Login from "./components/Login/Login";

const SomeRoute = () => {
  return <p> Some Route </p>
};

export interface PrivateRouteProps extends RouteProps  {
  loggedIn: boolean
}


const PrivateRoute = ({ loggedIn, component, ...rest }: PrivateRouteProps) => (
      <Route
          {...rest}
          render={(props: RouteProps) =>
              loggedIn ?
                  <Component {...props} /> : (
                  <Redirect
                      to={{
                        pathname: "/login",
                        state: {from: props.location}
                      }}
                  />
              )
          }
      />
  );

export interface AppState  {
  loggedIn: boolean
}

class App extends Component <{}, AppState> {
  state = {
    loggedIn: false
  };

  loginSuccess = () => {
    this.setState({
      loggedIn: true
    })
  }


  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
                path="/login"
                render={(props: RouteComponentProps) => (<Login {...props} loginSuccess={this.loginSuccess} />)}
            />
            <PrivateRoute loggedIn={loggedIn}  path="/" component={SomeRoute} />
          </Switch>
        </Router>
      </div>
    );
  }
}



export default App;
