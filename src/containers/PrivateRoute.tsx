/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Redirect, Route, RouteProps} from "react-router";

export interface PrivateRouteProps extends RouteProps {
  loggedIn: boolean
}

export class PrivateRoute extends React.Component<PrivateRouteProps, {}> {

  public render(): ReactNode {
    const {loggedIn, component, ...rest} = this.props;
    const ComponentToRender: React.ComponentType<any> = component!;
    return (
      <Route
        {...rest}
        render={(props: RouteProps) => loggedIn ?
            <ComponentToRender {...props} /> : (
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
  }
}