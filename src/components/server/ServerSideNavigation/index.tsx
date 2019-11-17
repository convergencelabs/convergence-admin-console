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

import * as React from 'react';
import {ReactNode} from 'react';
import {SideNavigation, SideNavigationMenuItem} from "../../common/SideNavigation/";
import {STORES} from "../../../stores/StoreConstants";
import {injectObserver} from "../../../utils/mobx-utils";
import {ConfigStore} from "../../../stores/ConfigStore";

interface InjectedProps {
  configStore: ConfigStore;
}

class ServerSideNavigationComponent extends React.Component<InjectedProps, {}> {


  public render(): ReactNode {
    const {namespacesEnabled} = this.props.configStore;

    const menus: SideNavigationMenuItem[] = [
      {key: "home", icon: "home", title: "Home", link: "/", routeMatch: {path: "/", exact: true}},
      {key: "namespaces", icon: "folder", title: "Namespaces", link: "/namespaces", routeMatch: {path: "/namespaces"}},
      {key: "domains", icon: "database", title: "Domains", link: "/domains", routeMatch: {path: "/domains"}},
      {key: "users", icon: "user", title: "Convergence Users", link: "/users", routeMatch: {path: "/users"}},
      {key: "settings", icon: "setting", title: "Settings", link: "/settings", routeMatch: {path: "/settings"}}
    ];

    if (!namespacesEnabled) {
      menus.splice(1, 1);
    }

    return (<SideNavigation menus={menus}/>);
  }
}

const injections = [STORES.CONFIG_STORE];
export const ServerSideNavigation = injectObserver<{}>(injections, ServerSideNavigationComponent);
