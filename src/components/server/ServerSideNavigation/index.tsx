import * as React from 'react';
import {SideNavigation, SideNavigationMenuItem} from "../../common/SideNavigation/";
import {ReactNode} from "react";
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
