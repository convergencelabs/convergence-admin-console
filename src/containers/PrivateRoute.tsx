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